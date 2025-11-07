import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { insightStoxLogo } from "../../constants.js";
export const getOtpEmailTemplate = (otp,message,time) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatePath = path.join(__dirname, "otpTemplate.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    htmlTemplate = htmlTemplate.replace("{OTP}", otp).replace("{MESSAGE}", message).replace("{TIME}",time).replace("{LOGO}", insightStoxLogo);
    return htmlTemplate;
}