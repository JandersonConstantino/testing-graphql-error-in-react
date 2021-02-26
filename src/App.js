import React from "react";
import { gql, useMutation } from "@apollo/client";

export const DEFINE_NICKNAME = gql`
  mutation DefineNickname($nickname: String!) {
    defineNickname(nickname: $nickname) {
      nickname
    }
  }
`;

function App({ onSuccess, onError }) {
  const [nickname, setNickname] = React.useState("");
  const [defineNickname, { loading }] = useMutation(DEFINE_NICKNAME);

  const onSubmit = async () => {
    try {
      const data = await defineNickname({ variables: { nickname } });
      onSuccess(data);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div>
      <label id="label-nickname" htmlFor="input-nickname">
        Nickname
      </label>
      <input
        id="input-nickname"
        data-testid="input-nickname"
        placeholder="Preencha seu nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        disabled={loading}
      />
      <button
        id="button-submit"
        data-testid="button-submit"
        onClick={onSubmit}
        disabled={loading}
      >
        Next
      </button>
    </div>
  );
}

export default App;
