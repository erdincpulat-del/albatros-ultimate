export const certificateA4Layout = {
  page: {
    width: 1152,
    height: 1536,
  },

  fullName: {
    x: 576,
    y: 640,
    fontFamily: "Cinzel, serif",
    fontSize: 62,
    fontWeight: 700,
    letterSpacing: 1.2,
    fill: "#24335B",
    textAnchor: "middle",
  },

  program: {
    line1: {
      x: 576,
      y: 884,
      fontFamily: "Cinzel, serif",
      fontSize: 45,
      fontWeight: 600,
      fill: "#24335B",
      textAnchor: "middle",
    },
    line2: {
      x: 576,
      y: 944,
      fontFamily: "Cinzel, serif",
      fontSize: 45,
      fontWeight: 600,
      fill: "#24335B",
      textAnchor: "middle",
    },
  },

  details: {
    labelStyle: {
      fontFamily: "Cormorant Garamond, serif",
      fontSize: 28,
      fontWeight: 600,
      fill: "#24335B",
    },

    valueStyle: {
      fontFamily: "Cormorant Garamond, serif",
      fontSize: 26,
      fontWeight: 500,
      fill: "#1F2433",
    },

    qualification: {
      label: { x: 138, y: 1116 },
      value: { x: 138, y: 1162 },
    },

    seaMiles: {
      label: { x: 138, y: 1228 },
      value: { x: 138, y: 1274 },
    },

    certificateId: {
      label: { x: 138, y: 1336 },
      value: { x: 138, y: 1382 },
    },

    issueDate: {
      label: { x: 138, y: 1442 },
      value: { x: 138, y: 1488 },
    },
  },

  qr: {
    x: 764,
    y: 1166,
    size: 120,
    captionX: 824,
    captionY: 1316,
    noteY: 1336,
    urlY: 1356,
  },

  signature: {
    image: {
      x: 354,
      y: 1126,
      width: 250,
      height: 90,
    },

    name: {
      x: 480,
      y: 1250,
      fontFamily: "Cormorant Garamond, serif",
      fontSize: 24,
      fontWeight: 500,
      fill: "#24335B",
      textAnchor: "middle",
    },

    role: {
      x: 480,
      y: 1290,
      fontFamily: "Cormorant Garamond, serif",
      fontSize: 22,
      fontWeight: 400,
      fill: "#2F3A55",
      textAnchor: "middle",
    },
  },
} as const;