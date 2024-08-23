import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import pdfFormat from "../../assets/images/pdfFormat.png";

const loadTemplate = async () => {
  const response = await fetch(pdfFormat);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
};

const splitTextIntoPages = (text, maxCharsPerPage) => {
  const pages = [];
  let start = 0;
  while (start < text.length) {
    pages.push(text.slice(start, start + maxCharsPerPage));
    start += maxCharsPerPage;
  }
  return pages;
};

export const generatePDF = async (largeString) => {
  const templateArrayBuffer = await loadTemplate();
  const pdfDoc = await PDFDocument.create();

  const templateImage = await pdfDoc.embedPng(templateArrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pageWidth = 612;
  const pageHeight = 792;
  const fontSize = 12;
  const lineHeight = fontSize + 2;

  const maxCharsPerLine = 90;
  const maxLinesPerPage = 45;
  const maxCharsPerPage = maxCharsPerLine * maxLinesPerPage;

  const textPages = splitTextIntoPages(largeString, maxCharsPerPage);

  textPages.forEach((pageText, index) => {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const imgDims = templateImage.scale(1);

    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      opacity: 1,
    });

    const lines = pageText.match(new RegExp(`.{1,${maxCharsPerLine}}`, "g"));
    lines.forEach((line, i) => {
      page.drawText(line, {
        x: 50,
        y: pageHeight - 10 - (i + 1) * lineHeight,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
    });
  });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "template.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
