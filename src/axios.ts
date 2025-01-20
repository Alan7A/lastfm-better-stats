import redaxios from "redaxios";

const params = {
  api_key: process.env.NEXT_PUBLIC_LASTFM_API_KEY,
  format: "json"
};

export const axios = redaxios.create({
  baseURL: "https://ws.audioscrobbler.com/2.0",
  params
});
