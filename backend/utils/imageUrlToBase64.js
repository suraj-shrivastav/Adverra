import axios from "axios";

export const imageUrlToBase64 = async (imageUrl) => {
    const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
    });

    return {
        data: Buffer.from(response.data).toString("base64"),
        mimeType: response.headers["content-type"],
    };
};
