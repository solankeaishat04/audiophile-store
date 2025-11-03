import { mutation } from "./_generated/server";

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").collect();
    if (existing.length > 0) {
      console.log("Products already seeded ✅");
      return;
    }

    const products = [
      {
        name: "XX99 Mark II Headphones",
        slug: "xx99-mark-two",
        category: "headphones",
        price: 2999,
        description: "The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.",
        features: "Featuring a genuine leather head strap and premium earcups, these headphones deliver superior comfort for extended use. They're equipped with active noise cancellation to ensure immersive sound experience.",
        inBox: [
          { quantity: 1, item: "Headphone Unit" },
          { quantity: 2, item: "Replacement Earcups" },
          { quantity: 1, item: "User Manual" },
          { quantity: 1, item: "3.5mm Audio Cable" },
          { quantity: 1, item: "Travel Bag" }
        ],
       image: "/image/x99 ii.png", // Match your frontend path
        gallery: ["/image/image-gallery-1.jpg", "/image/image-gallery-2.jpg", "/image/image-gallery-3.jpg"],
        new: true
      },
      {
        name: "XX99 Mark I Headphones",
        slug: "xx99-mark-one", 
        category: "headphones",
        price: 1750,
        description: "As the golden standard for headphones, the classic XX99 Mark I offers detailed and accurate audio reproduction for audiophiles, mixing engineers, and music enthusiasts alike.",
        features: "The XX99 Mark I combines high build quality with comfort and superior sound performance. It remains an audiophile's go-to choice with its timeless design and exceptional audio fidelity.",
        inBox: [
          { quantity: 1, item: "Headphone Unit" },
          { quantity: 2, item: "Replacement Earcups" },
          { quantity: 1, item: "User Manual" },
          { quantity: 1, item: "3.5mm Audio Cable" },
        ],
        image:"/image/mark x99.png", // Match your frontend path
        gallery: ["/image/x99 2i.png", "/image/x99 2ii.png", "/image/x99 2iii.png"], // Use actual gallery images
      },
      {
        name: "XX59 Headphones",
        slug: "xx59",
        category: "headphones", 
        price: 899,
        description: "Enjoy your favorite tunes with the stylish XX59 headphones. They combine comfort, exceptional build quality, and balanced sound for an incredible everyday listening experience.",
        features: "The XX59 headphones deliver balanced tone and crisp audio, offering high-end performance at a budget-friendly price. Enjoy premium build and comfort without compromise.",
        inBox: [
          { quantity: 1, item: "Headphone Unit" },
          { quantity: 2, item: "Replacement Earcups" },
          { quantity: 1, item: "User Manual" },
          { quantity: 1, item: "3.5mm Audio Cable" },
        ],
        image: "/image/xx59.png", // Make sure this file exists
        gallery: ["/image/xx59 i.jpg", "/image/xx59 ii.jpg", "/image/xx59 iii.jpg"], // Use actual gallery images
      },
      {
        name: "ZX9 SPEAKER",
        slug: "zx9-speaker",
        category: "speakers",
        price: 4500,
        description: "Upgrade your sound experience with the ZX9 speaker. Featuring a high-fidelity design and wireless technology for a seamless experience.",
        features: "The ZX9 is built with dual speakers that deliver crystal-clear highs and deep bass. Built for large spaces, this speaker dominates the soundstage with powerful audio performance.",
        inBox: [
          { quantity: 2, item: "Speaker Unit" },
          { quantity: 2, item: "Speaker Cloth Panel" },
          { quantity: 1, item: "User Manual" },
          { quantity: 1, item: "3.5mm Audio Cable" },
          { quantity: 1, item: "Power Cable" },
        ],
        image: "/image/zx9 speaker.png", // Make sure this file exists
        gallery: ["/image/z9i.jpg", "/image/z9ii.jpg", "/image/z9iii.jpg"],
        new: true,
      },
      {
        name: "ZX7 SPEAKER", 
        slug: "zx7-speaker",
        category: "speakers",
        price: 3500,
        description: "Stream high-quality sound wirelessly with the ZX7 speaker. Designed for those who crave audio precision and performance.",
        features: "Experience balanced sound with wide-range drivers and a compact build. The ZX7 delivers superior sound without distortion in any environment.",
        inBox: [
          { quantity: 2, item: "Speaker Unit" },
          { quantity: 2, item: "Speaker Cloth Panel" },
          { quantity: 1, item: "User Manual" },
          { quantity: 1, item: "3.5mm Audio Cable" },
        ],
        image: "/image/image-zx7-speaker.jpg", // Make sure this file exists
        gallery: ["/image/zx7i.jpg", "/image/zx7ii.jpg", "/image/zx7iii.jpg"],
      },
      {
        name: "YX1 EARPHONES",
        slug: "yx1-earphones", 
        category: "earphones",
        price: 599,
        description: "The YX1 wireless earphones bring freedom and superior sound to your daily life. Compact, comfortable, and high-performance.",
        features: "Engineered with noise isolation and seamless Bluetooth pairing, the YX1 offers an immersive listening experience for every moment with exceptional battery life.",
        inBox: [
          { quantity: 2, item: "Earphone Units" },
          { quantity: 6, item: "Multi-size Earplugs" },
          { quantity: 1, item: "User Manual" },
          { quantity: 1, item: "USB-C Charging Cable" },
          { quantity: 1, item: "Travel Pouch" },
        ],
        image:"/public/image/image-earphones-yx1.jpg", 
        gallery: ["/image/yx1.jpg", "/image/yx2.jpg", "/image/yx3.jpg"],
        new: true,
      },
    ];

    for (const p of products) {
      await ctx.db.insert("products", p);
    }

    console.log("✅ Seeded 6 Audiophile products successfully!");
  },
});