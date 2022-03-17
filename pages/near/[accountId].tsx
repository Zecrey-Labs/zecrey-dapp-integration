import { useRouter } from "next/router";
import { useEffect } from "react";
import ConnectedNear from "../../components/ConnectedNear";

const NearPage = () => {
  const router = useRouter();
  const { accountId } = router.query;

  useEffect(() => {
    if (!accountId) router.push("/");
  }, [accountId, router]);

  return <ConnectedNear accountId={(accountId as string) || ""} />;
};

export default NearPage;
