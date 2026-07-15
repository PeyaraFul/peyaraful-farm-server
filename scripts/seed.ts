import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/peyaraful-farm";

const animals = [
  {
    name: "Lakshmi",
    type: "cow",
    breed: "Holstein Friesian",
    age: 36,
    weight: 650,
    price: 85000,
    color: "Black & White",
    imageUrl: "/images/cow1.jpg",
    description:
      "High-yielding dairy cow producing 25+ liters daily. Healthy and well-fed.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-01-10"),
  },
  {
    name: "Nandini",
    type: "cow",
    breed: "Sahiwal",
    age: 48,
    weight: 450,
    price: 72000,
    imageUrl: "/images/cow2.jpg",
    color: "Reddish Brown",
    description:
      "Desi breed with excellent disease resistance. Great for rural farms.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-01-15"),
  },
  {
    name: "Gauri",
    type: "cow",
    breed: "Jersey",
    age: 30,
    weight: 400,
    price: 68000,
    imageUrl: "/images/cow3.jpg",
    color: "Light Brown",
    description:
      "Compact Jersey cow with rich milk fat content. Ideal for dairy farms.",
    status: "sold",
    sellerId: "admin",
    createdAt: new Date("2025-02-01"),
  },
  {
    name: "Radha",
    type: "cow",
    breed: "Red Sindhi",
    age: 42,
    weight: 420,
    price: 65000,
    imageUrl: "/images/cow4.jpg",
    color: "Deep Red",
    description:
      "Hardy breed adapted to tropical climate. Good milk yield with minimal care.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-02-10"),
  },
  {
    name: "Kamala",
    type: "cow",
    breed: "Crossbreed",
    age: 24,
    weight: 380,
    price: 55000,
    imageUrl: "/images/cow5.jpg",
    color: "Brown & White",
    description:
      "Young crossbreed with good growth potential. Vaccinated and healthy.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-02-20"),
  },
  {
    name: "Sita",
    type: "cow",
    breed: "Holstein Friesian",
    age: 60,
    weight: 700,
    price: 90000,
    imageUrl: "/images/cow6.jpg",
    color: "Black",
    description:
      "Mature HF cow with proven track record. 30+ liters daily production.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-03-01"),
  },
  {
    name: "Saraswati",
    type: "cow",
    breed: "Gir",
    age: 36,
    weight: 380,
    price: 78000,
    imageUrl: "/images/cow7.jpg",
    color: "Red with White Spots",
    description:
      "Premium Gir breed from Gujarat. Known for A2 milk quality.",
    status: "sold",
    sellerId: "admin",
    createdAt: new Date("2025-03-10"),
  },
  {
    name: "Durga",
    type: "cow",
    breed: "Tharparkar",
    age: 54,
    weight: 480,
    price: 70000,
    imageUrl: "/images/cow8.jpg",
    color: "Greyish White",
    description:
      "Dual-purpose breed for milk and draught. Very calm temperament.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-03-15"),
  },
  {
    name: "Mukta",
    type: "cow",
    breed: "Jersey",
    age: 18,
    weight: 320,
    price: 48000,
    imageUrl: "/images/cow9.jpg",
    color: "Fawn",
    description:
      "Young heifer ready for first calving. Excellent genetic lineage.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-04-01"),
  },
  {
    name: "Parvati",
    type: "cow",
    breed: "Sahiwal",
    age: 72,
    weight: 500,
    price: 60000,
    imageUrl: "/images/cow10.jpg",
    color: "Dark Brown",
    description:
      "Experienced mother cow. Still producing well at 6 years.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-04-10"),
  },
  {
    name: "Balaram",
    type: "buffalo",
    breed: "Murrah",
    age: 60,
    weight: 800,
    price: 95000,
    imageUrl: "/images/buff1.jpg",
    color: "Jet Black",
    description:
      "Prize-winning Murrah bull. Strong build, excellent for breeding.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-01-12"),
  },
  {
    name: "Ganga",
    type: "buffalo",
    breed: "Murrah",
    age: 48,
    weight: 650,
    price: 82000,
    imageUrl: "/images/buff2.jpg",
    color: "Black",
    description:
      "High milk-producing Murrah buffalo. 15+ liters daily with good fat content.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-02-05"),
  },
  {
    name: "Yamuna",
    type: "buffalo",
    breed: "Nili-Ravi",
    age: 36,
    weight: 600,
    price: 75000,
    imageUrl: "/images/buff3.jpg",
    color: "Black with White Markings",
    description:
      "Premium Nili-Ravi buffalo. Beautiful markings, excellent milk producer.",
    status: "sold",
    sellerId: "admin",
    createdAt: new Date("2025-02-15"),
  },
  {
    name: "Saraswati",
    type: "buffalo",
    breed: "Mehsana",
    age: 42,
    weight: 580,
    price: 70000,
    imageUrl: "/images/buff4.jpg",
    color: "Dark Grey",
    description:
      "Mehsana breed known for high fat milk. Perfect for butter and ghee production.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-03-05"),
  },
  {
    name: "Krishna",
    type: "buffalo",
    breed: "Jaffarabadi",
    age: 54,
    weight: 900,
    price: 110000,
    imageUrl: "/images/buff5.jpg",
    color: "Black",
    description:
      "Massive Jaffarabadi buffalo. Heavy milker with docile nature.",
    status: "available",
    sellerId: "admin",
    createdAt: new Date("2025-03-20"),
  },
];

const careTips = [
  {
    title: "Feeding Schedule",
    tip: "Feed your cattle 2-3 times daily with a balanced mix of green fodder, hay, and concentrated feed.",
  },
  {
    title: "Vaccination",
    tip: "Keep up with annual vaccinations for FMD, HS, and BQ to prevent common diseases.",
  },
  {
    title: "Clean Water",
    tip: "Ensure 40-60 liters of clean water daily for each adult cow or buffalo.",
  },
  {
    title: "Shelter",
    tip: "Provide proper shade and ventilation. Cattle need protection from extreme heat and rain.",
  },
  {
    title: "Regular Health Check",
    tip: "Schedule monthly vet visits to catch any health issues early.",
  },
  {
    title: "Hygiene",
    tip: "Keep the shed clean and dry. Remove dung daily to prevent infections and foul smell.",
  },
  {
    title: "Milking Hygiene",
    tip: "Always wash udders before milking. Use clean equipment to maintain milk quality.",
  },
  {
    title: "Grooming",
    tip: "Brush your cattle regularly to improve blood circulation and keep their coat healthy.",
  },
  {
    title: "Breeding Tips",
    tip: "Choose proven bulls or use artificial insemination for best results. Track heat cycles carefully.",
  },
  {
    title: "Winter Care",
    tip: "In winter, provide extra bedding and warm water. Increase feed intake to maintain body temperature.",
  },
];

const contactMessages = [
  {
    name: "Rahim Uddin",
    email: "rahim@example.com",
    message: "Do you deliver to Sylhet? Interested in the Holstein Friesian cows.",
    createdAt: new Date("2025-04-01"),
  },
  {
    name: "Fatima Begum",
    email: "fatima@example.com",
    message: "Can I visit the farm before purchasing? Looking for a Murrah buffalo.",
    createdAt: new Date("2025-04-05"),
  },
  {
    name: "Kamal Hossain",
    email: "kamal@example.com",
    message: "What is the price range for Jersey cows? Do you offer installment plans?",
    createdAt: new Date("2025-04-10"),
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    message: "I purchased a Sahiwal cow last month. Very happy with the quality!",
    createdAt: new Date("2025-04-12"),
  },
  {
    name: "Abdur Rahman",
    email: "abdur@example.com",
    message: "Looking for a pair of cows for my dairy farm in Comilla. Any deals?",
    createdAt: new Date("2025-04-15"),
  },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();
    console.log("Connected to MongoDB for seeding...");

    // Animals
    const animalResult = await db.collection("animals").insertMany(animals);
    console.log(`Inserted ${animalResult.insertedCount} animals`);

    // Grab inserted animal IDs for favorites/orders/reviews
    const allAnimals = await db.collection("animals").find().toArray();
    const availableAnimals = allAnimals.filter((a) => a.status === "available");
    const soldAnimals = allAnimals.filter((a) => a.status === "sold");

    const user1 = new ObjectId().toHexString();
    const user2 = new ObjectId().toHexString();

    // Favorites
    const favorites = [
      { userId: user1, animalId: allAnimals[0]._id.toString() },
      { userId: user1, animalId: allAnimals[2]._id.toString() },
      { userId: user1, animalId: allAnimals[10]._id.toString() },
      { userId: user2, animalId: allAnimals[1]._id.toString() },
      { userId: user2, animalId: allAnimals[4]._id.toString() },
      { userId: user2, animalId: allAnimals[11]._id.toString() },
    ];
    const favResult = await db.collection("favorites").insertMany(favorites);
    console.log(`Inserted ${favResult.insertedCount} favorites`);

    // Orders (for sold animals)
    const orders = [
      {
        buyerId: user1,
        animalId: soldAnimals[0]._id.toString(),
        price: soldAnimals[0].price,
        status: "paid",
        createdAt: new Date("2025-03-15"),
      },
      {
        buyerId: user2,
        animalId: soldAnimals[1]._id.toString(),
        price: soldAnimals[1].price,
        status: "paid",
        createdAt: new Date("2025-03-25"),
      },
      {
        buyerId: user1,
        animalId: allAnimals[5]._id.toString(),
        price: allAnimals[5].price,
        status: "pending",
        createdAt: new Date("2025-04-10"),
      },
      {
        buyerId: user2,
        animalId: allAnimals[8]._id.toString(),
        price: allAnimals[8].price,
        status: "pending",
        createdAt: new Date("2025-04-12"),
      },
    ];
    const orderResult = await db.collection("orders").insertMany(orders);
    console.log(`Inserted ${orderResult.insertedCount} orders`);

    // Reviews (only for paid orders)
    const reviews = [
      {
        orderId: orders[0]._id.toString(),
        userId: user1,
        animalId: soldAnimals[0]._id.toString(),
        rating: 5,
        comment:
          "Excellent cow! Produces more milk than expected. Very healthy.",
        createdAt: new Date("2025-04-01"),
      },
      {
        orderId: orders[1]._id.toString(),
        userId: user2,
        animalId: soldAnimals[1]._id.toString(),
        rating: 4,
        comment:
          "Good quality Gir cow. A2 milk is great for my family. Minor delay in delivery.",
        createdAt: new Date("2025-04-05"),
      },
    ];
    const reviewResult = await db.collection("reviews").insertMany(reviews);
    console.log(`Inserted ${reviewResult.insertedCount} reviews`);

    // Care tips
    const careResult = await db.collection("care_tips").insertMany(careTips);
    console.log(`Inserted ${careResult.insertedCount} care tips`);

    // Contact messages
    const contactResult = await db
      .collection("contact_messages")
      .insertMany(contactMessages);
    console.log(`Inserted ${contactResult.insertedCount} contact messages`);

    console.log("\nSeeding complete!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();
