import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fs from "fs";
import * as path from "path";

async function generateDemoPdf() {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();

  // Colors
  const navy = rgb(11 / 255, 31 / 255, 58 / 255);
  const skyBlue = rgb(46 / 255, 139 / 255, 255 / 255);
  const orange = rgb(255 / 255, 138 / 255, 61 / 255);
  const darkGray = rgb(50 / 255, 55 / 255, 65 / 255);
  const lightGray = rgb(240 / 255, 243 / 255, 248 / 255);
  const borderGray = rgb(220 / 255, 226 / 255, 235 / 255);

  let y = height - 50;

  // Header Banner
  page.drawRectangle({
    x: 40,
    y: y - 50,
    width: width - 80,
    height: 60,
    color: navy,
  });

  page.drawText("GREEDY ADVENTURES  •  SEA VIEW SKYDIVING", {
    x: 55,
    y: y - 22,
    size: 11,
    font: fontBold,
    color: skyBlue,
  });

  page.drawText("Sea View Skydiving Brochure (Demo material)", {
    x: 55,
    y: y - 42,
    size: 16,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  y -= 80;

  // Demo Pill
  page.drawRectangle({
    x: 40,
    y: y - 10,
    width: 140,
    height: 20,
    color: orange,
  });
  page.drawText("DEMO MATERIAL", {
    x: 50,
    y: y - 5,
    size: 9,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  y -= 28;

  // Experience Overview
  page.drawText("The Premier Coastal Tandem Skydive in Pattaya, Thailand", {
    x: 40,
    y: y,
    size: 13,
    font: fontBold,
    color: navy,
  });
  y -= 18;

  const introText = [
    "Experience an adrenaline-charged 120 mph coastal freefall from 13,000 feet above the Gulf of Thailand.",
    "Operated by Dropzone Thailand with USPA-certified tandem instructors, offering daily flights all year round.",
    "Breathtaking ocean views, modern turbine aircraft ascent, and world-class safety protocols.",
  ];
  for (const line of introText) {
    page.drawText(line, {
      x: 40,
      y,
      size: 9.5,
      font: fontRegular,
      color: darkGray,
    });
    y -= 14;
  }

  y -= 10;

  // Packages Box
  page.drawText("THAILAND JUMP PACKAGES (PATTAYA)", {
    x: 40,
    y,
    size: 11,
    font: fontBold,
    color: navy,
  });
  y -= 16;

  const packages = [
    {
      name: "ECO PACKAGE - THB 9,500 / person",
      details: "Tandem jump only. Includes safety briefing, 13,000 ft flight, tandem master, and completion certificate.",
    },
    {
      name: "DELUXE PACKAGE - THB 12,500 / person",
      details: "Full jump experience + Instructor wrist-mounted HD video and high-resolution digital photos included.",
    },
    {
      name: "VIP PACKAGE - THB 14,000 / person",
      details: "Dedicated outside camera flyer freefalling alongside you + professional multi-angle video & edited film.",
    },
  ];

  for (const pkg of packages) {
    page.drawRectangle({
      x: 40,
      y: y - 28,
      width: width - 80,
      height: 36,
      color: lightGray,
      borderColor: borderGray,
      borderWidth: 1,
    });

    page.drawText(pkg.name, {
      x: 50,
      y: y - 10,
      size: 9.5,
      font: fontBold,
      color: navy,
    });

    page.drawText(pkg.details, {
      x: 50,
      y: y - 23,
      size: 8.5,
      font: fontRegular,
      color: darkGray,
    });

    y -= 44;
  }

  y -= 10;

  // What's Included
  page.drawText("WHAT IS INCLUDED IN EVERY PACKAGE", {
    x: 40,
    y,
    size: 11,
    font: fontBold,
    color: navy,
  });
  y -= 16;

  const inclusions = [
    "• Tandem skydive in Pattaya with USPA-certified tandem master",
    "• Thorough pre-flight ground safety briefing and custom harness fitting",
    "• Scenic 15-20 min aircraft climb to 13,000 feet over the coastline",
    "• Up to 60 seconds of thrilling coastal freefall at 120 mph terminal velocity",
    "• 5 to 7 minutes peaceful canopy flight with panoramic ocean views",
    "• Official certificate of completion signed by your tandem instructor",
    "• Multilingual instructors speaking English, Hindi, and Thai",
  ];

  for (const inc of inclusions) {
    page.drawText(inc, {
      x: 40,
      y,
      size: 9,
      font: fontRegular,
      color: darkGray,
    });
    y -= 13;
  }

  y -= 12;

  // Important Rules
  page.drawText("REQUIREMENTS & BOOKING POLICIES", {
    x: 40,
    y,
    size: 11,
    font: fontBold,
    color: navy,
  });
  y -= 16;

  const policies = [
    "• Age Requirement: 18+ with valid passport or government-issued photo ID.",
    "• Weight Limit: 100 kg maximum weight limit for tandem jumpers.",
    "• Payment Terms: No advance payment required. Pay at the dropzone on jump day.",
    "• Bangkok Transfers: Bangkok round-trip hotel pickup available as a fixed-price add-on.",
    "• Weather Policy: Weather holds permit waiting for next window, free date change, or full refund.",
    "• Cancellations: Free cancellation with more than 48 hours notice prior to jump date.",
  ];

  for (const pol of policies) {
    page.drawText(pol, {
      x: 40,
      y,
      size: 9,
      font: fontRegular,
      color: darkGray,
    });
    y -= 13;
  }

  y -= 15;

  // Contact Box
  page.drawRectangle({
    x: 40,
    y: y - 48,
    width: width - 80,
    height: 52,
    color: lightGray,
    borderColor: skyBlue,
    borderWidth: 1,
  });

  page.drawText("HOW TO CONTACT & BOOK", {
    x: 50,
    y: y - 14,
    size: 9.5,
    font: fontBold,
    color: navy,
  });

  page.drawText("WhatsApp (Fastest response, replies within the hour): +91 95357 68554", {
    x: 50,
    y: y - 28,
    size: 8.5,
    font: fontRegular,
    color: darkGray,
  });

  page.drawText("Website: https://www.greedyadventures.com/experiences/sea-view-skydiving", {
    x: 50,
    y: y - 40,
    size: 8.5,
    font: fontRegular,
    color: skyBlue,
  });

  // Footer Disclaimer
  page.drawText(
    "Demo material generated for this prototype; not an official Greedy Adventures document.",
    {
      x: 40,
      y: 35,
      size: 8,
      font: fontRegular,
      color: darkGray,
    }
  );

  const outDir = path.join(process.cwd(), "public", "media");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(outDir, "sea-view-skydiving-brochure.pdf");
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`Demo brochure successfully written to: ${filePath}`);
}

generateDemoPdf().catch((err) => {
  console.error("Failed to generate demo PDF:", err);
  process.exit(1);
});
