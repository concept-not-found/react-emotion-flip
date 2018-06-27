### 1.1.0 (June 27, 2018)
 * moved source from `componentWillUnmount` and put it behind the `unmountAsSource` option
 * added mounted and rendered locations as source
 * properly cleaned up animation classes
 * removed logic to handle empty bounds to avoid race condtions
 * prevented redunant animations when source and target are the same

### 1.0.0 (June 25, 2018)
 * implemented createFlip with reasonable animation options and escapes hatches
