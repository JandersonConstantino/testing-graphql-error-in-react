import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import { render, fireEvent, waitFor } from "@testing-library/react";
import App, { DEFINE_NICKNAME } from "./App";

describe("App", () => {
  it("onSuccess must be called when nickname is NOT defined for another user", async () => {
    /**
     * mock da função de sucesso para tornar possível a leitura
     * do valor que ela como argumento ao ser invocada
     */
    const onSuccess = jest.fn();

    /**
     * mock que será utilizado pelo provider do GraphQL
     */
    const mocks = [
      {
        request: {
          query: DEFINE_NICKNAME,
          variables: { nickname: "AnakinSkywalker" },
        },
        result: {
          /**
           * quando existe data no result do mock,
           * significa que essa requisição ocorreu corretamente,
           * sem erros.
           */
          data: { nickname: "AnakinSkywalker" },
        },
      },
    ];

    const { getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <App onSuccess={onSuccess} />
      </MockedProvider>
    );

    /**
     * aqui utilizamos o data-testid para pegar o Input de nickname
     * e após realizamos uma chamada do evento de change setando
     * o valor como "AnakinSkywalker"
     */
    const input = getByTestId("input-nickname");
    fireEvent.change(input, { target: { value: "AnakinSkywalker" } });

    /**
     * aqui utilizamos o data-testid para pegar o botão de submit
     * e após chamamos o click do botão, para disparar seu evento
     */
    const button = getByTestId("button-submit");
    fireEvent.click(button);

    await waitFor(() => {
      /**
       * aqui esperamos que a função de sucesso tenha sido chamada
       * com a data que definimos na resposta da requisição mock
       */
      expect(onSuccess).toBeCalledWith({
        data: { nickname: "AnakinSkywalker" },
      });
    });
  });

  it("onError must be called when nickname is defined for another user", async () => {
    /**
     * mock da função de erro para tornar possível a leitura
     * do valor que ela como argumento ao ser invocada
     */
    const onError = jest.fn();

    /**
     * mock que será utilizado pelo provider do GraphQL
     */
    const mocks = [
      {
        request: {
          query: DEFINE_NICKNAME,
          variables: { nickname: "MichaelJordan" },
        },
        result: {
          /**
           * quando existe errors no result do mock,
           * significa que a requisição teve um erro
           */
          errors: [new GraphQLError("Nickname in use!")],
        },
      },
    ];

    const { getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <App onError={onError} />
      </MockedProvider>
    );

    /**
     * aqui utilizamos o data-testid para pegar o Input de nickname
     * e após realizamos uma chamada do evento de change setando
     * o valor como "MichaelJordan"
     */
    const input = getByTestId("input-nickname");
    fireEvent.change(input, { target: { value: "MichaelJordan" } });

    /**
     * aqui utilizamos o data-testid para pegar o botão de submit
     * e após chamamos o click do botão, para disparar seu evento
     */
    const button = getByTestId("button-submit");
    fireEvent.click(button);

    await waitFor(() => {
      /**
       * aqui esperamos que a primeira chamada da função mock
       * no primeiro parâmetro tenha recebido um erro
       * e esse erro tenha a string "Nickname in use!"
       */
      expect(onError.mock.calls[0][0]).toEqual(new Error("Nickname in use!"));
    });
  });
});
