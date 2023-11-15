import axios from "axios";
import cheerio from "cheerio";

const flipkart = async (req, res) => {
  try {
    const pageUrl =
      "https://www.flipkart.com/mobile-phones-store?otracker=nmenu_sub_Electronics_0_Mobiles";
    const pageResponse = await axios.get(pageUrl);
    const $ = cheerio.load(pageResponse.data);
    const categoryUrls = [];
    let categoryArr = $("._37K3-p");
    for (const i of categoryArr) {
      const element = $(i);
      const categoryUrl = $(element).find(".h1Fvn6").attr("href");
      categoryUrls.push(categoryUrl);

      const productDetails = [];
      for (const productUrl of categoryUrls) {
        const fullProductUrl = `${productUrl}`;
        const details = await scrapeProductDetails(
          `https://www.flipkart.com${fullProductUrl}`
        );
        if (details) {
          productDetails.push(details);
        }
      }
      res.send(200).json({ data: productDetails });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
async function scrapeProductDetails(productUrl) {
  try {
    const response = await axios.get(productUrl);
    const $ = cheerio.load(response.data);

    const productName = $("._4rR01T").text();
    const productPrice = $("._30jeq3._1_WHN1").text().trim();

    return { name: productName, price: productPrice, url: productUrl };
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate limit exceeded");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await mobileCategoryController();
    } else {
      console.error("Error:", error.message);
    }
    console.error(error);
  }
}
export default flipkart;
