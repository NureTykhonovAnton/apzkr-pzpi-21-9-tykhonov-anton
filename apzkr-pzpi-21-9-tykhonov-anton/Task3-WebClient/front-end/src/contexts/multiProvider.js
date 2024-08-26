import React from "react";

/**
 * A utility function to nest child elements within a given component.
 * 
 * This function uses `React.cloneElement` to create a new element of the specified `component`
 * with `children` as its content. This is used to apply context providers to a component tree.
 *
 * @param {React.ReactNode} children - The child elements to be nested inside the `component`.
 * @param {React.ReactElement} component - The React component that will wrap the `children`.
 * @returns {React.ReactElement} - A new React element with `children` nested inside `component`.
 */
const nest = (children, component) =>
  React.cloneElement(component, {}, children);

/**
 * A component that applies multiple React context providers to its children.
 * 
 * This component accepts a list of `providers` and uses them to wrap the `children` elements.
 * The `providers` are applied from right to left, which is useful for composing multiple context providers.
 * 
 * Example Usage:
 * ```jsx
 * <MultiProvider
 *   providers={[
 *     <ProviderA key="a" value={valueA} />,
 *     <ProviderB key="b" value={valueB} />,
 *   ]}
 * >
 *   <YourComponent />
 * </MultiProvider>
 * ```
 * 
 * In this example, `YourComponent` will be rendered within the context of both `ProviderA` and `ProviderB`.
 *
 * @param {Object} props - The component's props.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the providers.
 * @param {React.ReactElement[]} props.providers - An array of provider components to wrap around the children.
 * @returns {React.ReactElement} - A React element with `children` wrapped by the specified `providers`.
 */
const MultiProvider = ({ children, providers }) => (
  <React.Fragment>
    {providers.reduceRight(nest, children)}
  </React.Fragment>
);

export default MultiProvider;
