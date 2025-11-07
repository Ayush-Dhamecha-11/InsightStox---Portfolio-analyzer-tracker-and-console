import fs from "fs";
import path from "path";

const createRemovePortfolioExcelSheet = () => {
    const portfolioDir = path.join("./public/portfolioData");
    const removeOldFiles = () => {
        const files = fs.readdirSync(portfolioDir);
        const now = Date.now();

        files.forEach(file => {
            const filePath = path.join(portfolioDir, file);
            const stats = fs.statSync(filePath);
            if (file.endsWith(".xlsx"))
            {
                if ((now - stats.ctimeMs) >= 60*1000) {
                    fs.unlinkSync(filePath);
                }
            }
        });
    };
    setInterval(removeOldFiles, 60*1000);

    return removeOldFiles;
};

export const removePortfolioExcelSheet = createRemovePortfolioExcelSheet();
