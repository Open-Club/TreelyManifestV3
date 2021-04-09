import TreeStyle from "./TreeStyle"

const IframeStyle = () => {

  return (
    `
      body {
        font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji';
      }
      ${TreeStyle()}
    `

  );
}

export default IframeStyle;
