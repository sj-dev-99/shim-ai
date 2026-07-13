export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/love-type",
      permanent: false
    }
  };
}

export default function IdealTypePage() {
  return null;
}
