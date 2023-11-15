import axios from "axios";
import cheerio from "cheerio";

const tshirtController = async (req, res) => {
  try {
    const categoryUrl =
      "https://www.snapdeal.com/products/men-apparel-tshirts?sort=plrty";
    const categoryResponse = await axios.get(categoryUrl);
    const $ = cheerio.load(categoryResponse.data);
    const productUrls = [];
    let categoryArr = $(".product-tuple-listing");
    for (const i of categoryArr) {
      const element = $(i);
      const productUrl = $(element)
        .find(".dp-widget-link.noUdLine")
        .attr("href");
      productUrls.push(productUrl);
    }

    const productDetails = [];
    for (const productUrl of productUrls) {
      const fullProductUrl = `${productUrl}`;
      const details = await scrapeProductDetails(fullProductUrl);
      if (details) {
        productDetails.push(details);
      }
    }
    res.send(200).json({ data: productDetails });
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
async function scrapeProductDetails(productUrl) {
  try {
    const response = await axios.get(productUrl);
    const $ = cheerio.load(response.data);

    const productName = $(".pdp-e-i-head").text().trim();
    const productPrice = $(".payBlkBig").text().trim();

    return { name: productName, price: productPrice, url: productUrl };
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate limit exceeded");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await tshirtController();
    } else {
      console.error("Error:", error.message);
    }
  }
}
export default tshirtController;
