type Mutable<TargetType> = {
  -readonly [P in keyof TargetType]: TargetType[P] extends ReadonlyArray<infer U> ? Array<U> : TargetType[P]
};


export default Mutable;
