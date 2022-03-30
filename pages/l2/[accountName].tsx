import { useRouter } from "next/router";
import { useEffect } from "react";
import ConnectedL2 from "../../components/ConnectedL2";

const NearPage = () => {
  const router = useRouter();
  const { accountName } = router.query;

  useEffect(() => {
    if (!accountName) router.push("/");
  }, [accountName, router]);

  return <ConnectedL2 accountName={(accountName as string) || ""} />;
};

export default NearPage;
