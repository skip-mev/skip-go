// use string instead of .css to avoid needing to use css loaders at buildtime
// using GlobalStyle from styled-component doesn't work with shadow dom
export const globalStyles = `
  * {
    font-style: unset;
    font-weight: unset;
    text-align: left;
    text-decoration: unset;
    text-indent: unset;
    text-transform: unset;
    line-height: unset;
    letter-spacing: unset;
    white-space: unset;
    box-sizing: border-box;
    margin: unset;
    padding: unset;
    visibility: unset;
    float: unset;
    clear: unset;
    background-color: unset;
    word-spacing: unset;
    font-family: 'ABCDiatype', sans-serif;
    
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;

  }
  u {
    text-decoration: underline;
  }
  div {
    box-sizing: border-box;
  }
`;
