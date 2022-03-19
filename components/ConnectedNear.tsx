import { utils } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { FormEvent, useMemo, useState } from "react";
import styles from "../styles/Home.module.css";
import * as nearAPI from "near-api-js";
import BigNumber from "bignumber.js";

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

  let network: "testnet" | "mainnet" = useMemo(() => {
    if (contract && contract.endsWith(".near")) {
      return "mainnet";
    } else {
      return "testnet";
    }
  }, [contract]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    let { decimals } = await nearReadStateWithoutAccount(
      network,
      contract,
      "ft_metadata",
      ""
    );
    const zecrey = (window as any).zecrey;
    if (zecrey) {
      try {
        setLoading(true);
        let val = await zecrey.request({
          method: "near_sendTransaction",
          params: {
            sender: props.sender,
            receiver: contract,
            action: "functionCall",
            args: [
              "ft_transfer",
              {
                receiver_id: to,
                amount: new BigNumber(value)
                  .times(new BigNumber(10).pow(decimals))
                  .toFixed(),
              },
              "300000000000000",
              "1",
            ],
          },
        });
        console.log("tx hash: ", val);
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

/**
 *
 * @param network
 * @param contractName
 * @param methodName
 * @param args
 * @returns
 */
export const nearReadStateWithoutAccount = async (
  network: "testnet" | "mainnet",
  contractName: string,
  methodName: string,
  args: any
) => {
  const provider = new nearAPI.providers.JsonRpcProvider(
    `https://rpc.${network}.near.org`
  );
  const args_base64 = args ? btoa(JSON.stringify(args)) : "";
  const raw = await provider.query({
    request_type: "call_function",
    account_id: contractName,
    method_name: methodName,
    args_base64,
    finality: "optimistic",
  });
  return JSON.parse(Buffer.from((raw as any).result).toString());
};
