import redaxios from "redaxios";

const params = {
  api_key: "f5ba663b649d64083f1838c060464515",
  format: "json",
};

export const axios = redaxios.create({
  baseURL: "https://ws.audioscrobbler.com/2.0",
  params,
});
