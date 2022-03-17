import { utils } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { FormEvent, useMemo, useState } from "react";
import styles from "../styles/Home.module.css";

const ConnectedNear = (props: { accountId: string }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3 style={{ margin: 0 }}>
          Wallet address: <code>{props.accountId}</code>
        </h3>
        <div className="columns">
          <TransferNear sender={props.accountId} />
          <TransferFT sender={props.accountId} />
        </div>
      </main>
    </div>
  );
};

export default ConnectedNear;

const isNearAccountId = (accountId: string) => {
  if (typeof accountId !== "string" || !accountId) return false;
  if (utils.isHexString("0x" + accountId) && accountId.length !== 64)
    return false;
  if (
    !utils.isHexString("0x" + accountId) &&
    !accountId.endsWith(".testnet") &&
    !accountId.endsWith(".near")
  )
    return false;
  let reg = /^(([a-zd]+[-_])*[a-zd]+\.)*([a-zd]+[-_])*[a-zd]+$/;
  if (
    !utils.isHexString("0x" + accountId) &&
    (!reg.test(accountId) || accountId.length > 64)
  )
    return false;
  return true;
};

const TransferNear = (props: { sender: string }) => {
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const disabled = useMemo(() => {
    return !to || !value || !isNearAccountId(to) || loading;
  }, [to, value, loading]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const zecrey = (window as any).zecrey;
    if (zecrey) {
      try {
        setLoading(true);
        let val = await zecrey.request({
          method: "near_sendTransaction",
          params: {
            sender: props.sender,
            receiver: to,
            action: "transfer",
            args: [parseUnits(value, 24).toString()],
          },
        });
        console.log(val);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
      );
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className={styles.title}>Transfer Near</h2>
      <label>To</label>
      <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      <label>Amount</label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <br />
      <input
        type="submit"
        disabled={disabled}
        value={loading ? "Transfer..." : "Transfer"}
      />
    </form>
  );
};

const TransferFT = (props: { sender: string }) => {
  const [contract, setContract] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const disabled = useMemo(() => {
    return !contract || !to || !value || !isNearAccountId(to) || loading;
  }, [contract, to, value, loading]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const zecrey = (window as any).zecrey;
    if (zecrey) {
      try {
        setLoading(true);
        let val = await zecrey.request({
          method: "near_sendTransaction",
          params: {
            sender: props.sender,
            receiver: contract,
            action: "functionalCall",
            args: [
              "ft_transfer",
              {
                receiver_id: to,
                amount: parseUnits(value, 24).toString(),
              },
              parseUnits("4.5", 20).toString(),
              "0",
            ],
          },
        });
        console.log("val", val);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
      );
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className={styles.title}>Transfer ft-token</h2>
      <label>Contract</label>
      <input
        type="text"
        value={contract}
        onChange={(e) => setContract(e.target.value)}
      />
      <label>To</label>
      <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      <label>Amount</label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <br />
      <input
        type="submit"
        disabled={disabled}
        value={loading ? "Transfer..." : "Transfer"}
      />
    </form>
  );
};
