import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";

type DeleteAccountResponse = {
  ok: boolean;
  message: string;
};

function getBearerToken(req: NextApiRequest) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DeleteAccountResponse>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "허용되지 않은 요청입니다." });
  }

  const token = getBearerToken(req);
  const confirmation = typeof req.body?.confirmation === "string" ? req.body.confirmation.trim() : "";

  if (!token) {
    return res.status(401).json({ ok: false, message: "로그인이 필요합니다." });
  }

  if (confirmation !== "계정 삭제") {
    return res.status(400).json({ ok: false, message: "삭제 확인 문구가 일치하지 않습니다." });
  }

  try {
    const admin = createSupabaseAdminClient();
    const {
      data: { user },
      error: userError
    } = await admin.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ ok: false, message: "현재 로그인한 사용자를 확인하지 못했습니다." });
    }

    const userId = user.id;
    const deleteSteps = [
      admin.from("diary_entries").delete().eq("user_id", userId),
      admin.from("user_consents").delete().eq("user_id", userId),
      admin.from("profiles").delete().eq("id", userId)
    ];
    const results = await Promise.all(deleteSteps);
    const failedStep = results.find((result) => result.error);

    if (failedStep?.error) {
      return res.status(500).json({ ok: false, message: "계정 데이터를 삭제하지 못했습니다. 잠시 후 다시 시도해주세요." });
    }

    const { error: deleteUserError } = await admin.auth.admin.deleteUser(userId);
    if (deleteUserError) {
      return res.status(500).json({ ok: false, message: "계정을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요." });
    }

    return res.status(200).json({ ok: true, message: "계정과 개인 데이터가 삭제되었습니다." });
  } catch {
    return res.status(500).json({ ok: false, message: "계정 삭제 요청을 처리하지 못했습니다." });
  }
}
