const style = {
  paragraph: {
    fontSize: "0.875rem", // Small screens
    lineHeight: "1.25rem",
    "@media (min-width: 640px)": {
      fontSize: "1rem", // Medium screens
      lineHeight: "1.5rem",
    },
    "@media (min-width: 768px)": {
      fontSize: "1.125rem", // Larger screens
      lineHeight: "1.75rem",
    },
  },
  header: {
    h1: {
      fontSize: "1.5rem",
      fontWeight: "600",
      lineHeight: "2rem",
      marginTop: "1.5rem",
      marginBottom: "1rem",
      "@media (min-width: 640px)": {
        fontSize: "1.875rem",
        lineHeight: "2.25rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "2.25rem",
        lineHeight: "2.5rem",
      },
    },
    h2: {
      fontSize: "1.25rem",
      fontWeight: "600",
      lineHeight: "1.75rem",
      marginTop: "1.5rem",
      marginBottom: "0.75rem",
      "@media (min-width: 640px)": {
        fontSize: "1.5rem",
        lineHeight: "2rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1.875rem",
        lineHeight: "2.25rem",
      },
    },
    h3: {
      fontSize: "1.125rem",
      fontWeight: "600",
      lineHeight: "1.5rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      "@media (min-width: 640px)": {
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1.5rem",
        lineHeight: "2rem",
      },
    },
    h4: {
      fontSize: "1rem",
      fontWeight: "600",
      lineHeight: "1.5rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      "@media (min-width: 640px)": {
        fontSize: "1.125rem",
        lineHeight: "1.75rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
      },
    },
    h5: {
      fontSize: "0.9375rem",
      fontWeight: "600",
      lineHeight: "1.5rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      "@media (min-width: 640px)": {
        fontSize: "1rem",
        lineHeight: "1.5rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1.125rem",
        lineHeight: "1.5rem",
      },
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.25rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      "@media (min-width: 640px)": {
        fontSize: "0.9375rem",
        lineHeight: "1.25rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1rem",
        lineHeight: "1.5rem",
      },
    },
  },
  list: {
    container: { marginLeft: "1.25rem", marginBottom: "0.5rem" },
    listItem: { marginBottom: "0.25rem" },
  },
  quote: {
    container: {
      fontStyle: "italic",
      marginBlock: "2rem",
      padding: "1rem 1.5rem",
      borderRadius: "4px",
      backgroundColor: "#f9f9f9",
    },
    content: {
      fontSize: "1.125rem",
      lineHeight: "1.75rem",
      "@media (min-width: 640px)": {
        fontSize: "1.25rem",
        lineHeight: "2rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1.5rem",
        lineHeight: "2.25rem",
      },
    },
  },
  table: {
    table: { borderCollapse: "collapse", width: "100%", marginBottom: "1rem" },
    tableCell: { border: "1px solid #e2e8f0", padding: "0.5rem" },
    tableHeader: { backgroundColor: "#f7fafc", fontWeight: "600" },
  },
};

export default style;
