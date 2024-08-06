import React from "react"

const nest = (children, component) =>
  React.cloneElement(component, {}, children)

const MultiProvider = ({ children, providers }) => (
  <React.Fragment>{providers.reduceRight(nest, children)}</React.Fragment>
)

export default MultiProvider
