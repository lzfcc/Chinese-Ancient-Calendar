// adapted from https://louisrli.github.io/blog/2020/06/04/react-mathjax/#.YE-JZ7QzY8M
import React from 'react';

const typeset = (selector) => {
// If MathJax script hasn't been loaded yet, then do nothing.
  if (!window.MathJax) {
    return null;
  }
  window.MathJax.startup.promise.then(() => {
      selector();
      return window.MathJax.typesetPromise();
    })
    .catch((err) => console.error(`Typeset failed: ${err.message}`));
};

const Latex = ({ rawLatex }) => {
  const ref = React.createRef();
  React.useEffect(() => {
    typeset(() => ref.current);
  }, [rawLatex]);

  return <span ref={ref}>{rawLatex}</span>;
};

export default React.memo(Latex);
