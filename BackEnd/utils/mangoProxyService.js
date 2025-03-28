// /utils/mangoProxyService.js
import axios from "axios";
import {
  MANGO_PROXY_API_KEY,
  MANGO_PROXY_BASE_URL,
} from "../config/mangoProxy.js";

export const trackMangoUser = async (ip) => {
  try {
    console.log("Sending Mango Proxy request for IP:", ip);
    const response = await axios.get(`${MANGO_PROXY_BASE_URL}/track`, {
      headers: {
        Authorization: `Bearer ${MANGO_PROXY_API_KEY}`,
      },
      params: { ip },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Mango Proxy API Error:",
      error.response?.data || error.message
    );
    console.log(error.response?.data || error.message);
    return "Access denied 2"; // You may be sending this line
  }
};
