import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { gql } from "graphql-tag";

/* tslint:disable */
/* eslint-disable */

const VariableName = " $1fcbcbff-3e78-462f-b45c-668a3e09bfd8";

const ScalarBrandingField = " $1fcbcbff-3e78-462f-b45c-668a3e09bfd9";

type CustomScalar<T> = { [ScalarBrandingField]: T };

class Variable<T, Name extends string> {
  private [VariableName]: Name;
  // @ts-ignore
  private _type?: T;

  // @ts-ignore
  constructor(
    name: Name,
    private readonly isRequired?: boolean,
  ) {
    this[VariableName] = name;
  }
}

type ArrayInput<I> = [I] extends [$Atomic]
  ? never
  : ReadonlyArray<VariabledInput<I>>;

type AllowedInlineScalars<S> = S extends string | number ? S : never;

export type UnwrapCustomScalars<T> =
  T extends CustomScalar<infer S>
    ? S
    : T extends ReadonlyArray<infer I>
      ? ReadonlyArray<UnwrapCustomScalars<I>>
      : T extends Record<string, any>
        ? { [K in keyof T]: UnwrapCustomScalars<T[K]> }
        : T;

type VariableWithoutScalars<T, Str extends string> = Variable<
  UnwrapCustomScalars<T>,
  Str
>;

// the array wrapper prevents distributive conditional types
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
type VariabledInput<T> = [T] extends [CustomScalar<infer S> | null | undefined]
  ? // scalars only support variable input
    | Variable<S | null | undefined, any>
      | AllowedInlineScalars<S>
      | null
      | undefined
  : [T] extends [CustomScalar<infer S>]
    ? Variable<S, any> | AllowedInlineScalars<S>
    : [T] extends [$Atomic]
      ? Variable<T, any> | T
      : T extends ReadonlyArray<infer I>
        ? VariableWithoutScalars<T, any> | T | ArrayInput<I>
        : T extends Record<string, any> | null | undefined
          ?
              | VariableWithoutScalars<T | null | undefined, any>
              | null
              | undefined
              | { [K in keyof T]: VariabledInput<T[K]> }
              | T
          : T extends Record<string, any>
            ?
                | VariableWithoutScalars<T, any>
                | { [K in keyof T]: VariabledInput<T[K]> }
                | T
            : never;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

/**
 * Creates a new query variable
 *
 * @param name The variable name
 */
export const $ = <Type, Name extends string>(
  name: Name,
): Variable<Type, Name> => {
  return new Variable(name);
};

/**
 * Creates a new query variable. A value will be required even if the input is optional
 *
 * @param name The variable name
 */
export const $$ = <Type, Name extends string>(
  name: Name,
): Variable<NonNullable<Type>, Name> => {
  return new Variable(name, true);
};

type SelectOptions = {
  argTypes?: { [key: string]: string };
  args?: { [key: string]: any };
  selection?: Selection<any>;
};

class $Field<Name extends string, Type, Vars = {}> {
  public kind: "field" = "field";
  public type!: Type;

  public vars!: Vars;
  public alias: string | null = null;

  constructor(
    public name: Name,
    public options: SelectOptions,
  ) {}

  as<Rename extends string>(alias: Rename): $Field<Rename, Type, Vars> {
    const f = new $Field(this.name, this.options);
    f.alias = alias;
    return f as any;
  }
}

class $Base<Name extends string> {
  // @ts-ignore
  constructor(private $$name: Name) {}

  protected $_select<Key extends string>(
    name: Key,
    options: SelectOptions = {},
  ): $Field<Key, any, any> {
    return new $Field(name, options);
  }
}

// @ts-ignore
class $Union<T, Name extends String> extends $Base<Name> {
  // @ts-ignore
  private $$type!: T;
  // @ts-ignore
  private $$name!: Name;

  constructor(
    private selectorClasses: { [K in keyof T]: { new (): T[K] } },
    $$name: Name,
  ) {
    super($$name);
  }

  $on<Type extends keyof T, Sel extends Selection<T[Type]>>(
    alternative: Type,
    selectorFn: (selector: T[Type]) => [...Sel],
  ): $UnionSelection<GetOutput<Sel>, GetVariables<Sel>> {
    const selection = selectorFn(new this.selectorClasses[alternative]());

    return new $UnionSelection(alternative as string, selection);
  }
}

// @ts-ignore
class $Interface<T, Name extends string> extends $Base<Name> {
  // @ts-ignore
  private $$type!: T;
  // @ts-ignore
  private $$name!: Name;

  constructor(
    private selectorClasses: { [K in keyof T]: { new (): T[K] } },
    $$name: Name,
  ) {
    super($$name);
  }
  $on<Type extends keyof T, Sel extends Selection<T[Type]>>(
    alternative: Type,
    selectorFn: (selector: T[Type]) => [...Sel],
  ): $UnionSelection<GetOutput<Sel>, GetVariables<Sel>> {
    const selection = selectorFn(new this.selectorClasses[alternative]());

    return new $UnionSelection(alternative as string, selection);
  }
}

class $UnionSelection<T, Vars> {
  public kind: "union" = "union";
  // @ts-ignore
  private vars!: Vars;
  constructor(
    public alternativeName: string,
    public alternativeSelection: Selection<T>,
  ) {}
}

type Selection<_any> = ReadonlyArray<
  $Field<any, any, any> | $UnionSelection<any, any>
>;

type NeverNever<T> = [T] extends [never] ? {} : T;

type Simplify<T> = { [K in keyof T]: T[K] } & {};

type LeafType<T> = T extends CustomScalar<infer S> ? S : T;

export type GetOutput<X extends Selection<any>> = Simplify<
  UnionToIntersection<
    {
      [I in keyof X]: X[I] extends $Field<infer Name, infer Type, any>
        ? { [K in Name]: LeafType<Type> }
        : never;
    }[keyof X & number]
  > &
    NeverNever<
      {
        [I in keyof X]: X[I] extends $UnionSelection<infer Type, any>
          ? LeafType<Type>
          : never;
      }[keyof X & number]
    >
>;

type PossiblyOptionalVar<VName extends string, VType> = null extends VType
  ? { [key in VName]?: VType }
  : { [key in VName]: VType };

type ExtractInputVariables<Inputs> =
  Inputs extends Variable<infer VType, infer VName>
    ? PossiblyOptionalVar<VName, VType>
    : // Avoid generating an index signature for possibly undefined or null inputs.
      // The compiler incorrectly infers null or undefined, and we must force access the Inputs
      // type to convince the compiler its "never", while still retaining {} as the result
      // for null and undefined cases
      // Works around issue 79
      Inputs extends null | undefined
      ? { [K in keyof Inputs]: Inputs[K] }
      : Inputs extends $Atomic
        ? {}
        : Inputs extends any[] | readonly any[]
          ? UnionToIntersection<
              {
                [K in keyof Inputs]: ExtractInputVariables<Inputs[K]>;
              }[keyof Inputs & number]
            >
          : UnionToIntersection<
              {
                [K in keyof Inputs]: ExtractInputVariables<Inputs[K]>;
              }[keyof Inputs]
            >;

export type GetVariables<
  Sel extends Selection<any>,
  ExtraVars = {},
> = UnionToIntersection<
  {
    [I in keyof Sel]: Sel[I] extends $Field<any, any, infer Vars>
      ? Vars
      : Sel[I] extends $UnionSelection<any, infer Vars>
        ? Vars
        : never;
  }[keyof Sel & number]
> &
  ExtractInputVariables<ExtraVars>;

type ArgVarType = {
  type: string;
  isRequired: boolean;
  array: {
    isRequired: boolean;
  } | null;
};

const arrRegex = /\[(.*?)\]/;

/**
 * Converts graphql string type to `ArgVarType`
 * @param input
 * @returns
 */
function getArgVarType(input: string): ArgVarType {
  const array = input.includes("[")
    ? {
        isRequired: input.endsWith("!"),
      }
    : null;

  const type = array ? arrRegex.exec(input)![1]! : input;
  const isRequired = type.endsWith("!");

  return {
    array,
    isRequired: isRequired,
    type: type.replace("!", ""),
  };
}

function fieldToQuery(prefix: string, field: $Field<any, any, any>) {
  const variables = new Map<
    string,
    { variable: Variable<any, any>; type: ArgVarType }
  >();

  function stringifyArgs(
    args: any,
    argTypes: { [key: string]: string },
    argVarType?: ArgVarType,
  ): string {
    switch (typeof args) {
      case "string":
        const cleanType = argVarType!.type;
        if ($Enums.has(cleanType!)) return args;
        else return JSON.stringify(args);
      case "number":
      case "boolean":
        return JSON.stringify(args);
      default:
        if (args == null) return "null";
        if (VariableName in (args as any)) {
          if (!argVarType)
            throw new globalThis.Error(
              "Cannot use variabe as sole unnamed field argument",
            );
          const variable = args as Variable<any, any>;
          const argVarName = variable[VariableName];
          variables.set(argVarName, { type: argVarType, variable: variable });
          return "$" + argVarName;
        }
        if (Array.isArray(args))
          return (
            "[" +
            args
              .map((arg) => stringifyArgs(arg, argTypes, argVarType))
              .join(",") +
            "]"
          );
        const wrapped = (content: string) =>
          argVarType ? "{" + content + "}" : content;
        return wrapped(
          Array.from(Object.entries(args))
            .map(([key, val]) => {
              let argTypeForKey = argTypes[key];
              if (!argTypeForKey) {
                throw new globalThis.Error(
                  `Argument type for ${key} not found`,
                );
              }
              const cleanType = argTypeForKey
                .replace("[", "")
                .replace("]", "")
                .replace(/!/g, "");
              return (
                key +
                ":" +
                stringifyArgs(
                  val,
                  $InputTypes[cleanType]!,
                  getArgVarType(argTypeForKey),
                )
              );
            })
            .join(","),
        );
    }
  }

  function extractTextAndVars(
    field: $Field<any, any, any> | $UnionSelection<any, any>,
  ) {
    if (field.kind === "field") {
      let retVal = field.name;
      if (field.alias) retVal = field.alias + ":" + retVal;
      const args = field.options.args,
        argTypes = field.options.argTypes;
      if (args && Object.keys(args).length > 0) {
        retVal += "(" + stringifyArgs(args, argTypes!) + ")";
      }
      let sel = field.options.selection;
      if (sel) {
        retVal += "{";
        for (let subField of sel) {
          retVal += extractTextAndVars(subField);
        }
        retVal += "}";
      }
      return retVal + " ";
    } else if (field.kind === "union") {
      let retVal = "... on " + field.alternativeName + " {";
      for (let subField of field.alternativeSelection) {
        retVal += extractTextAndVars(subField);
      }
      retVal += "}";

      return retVal + " ";
    } else {
      throw new globalThis.Error("Uknown field kind");
    }
  }

  const queryRaw = extractTextAndVars(field)!;

  const queryBody = queryRaw.substring(queryRaw.indexOf("{"));

  const varList = Array.from(variables.entries());
  let ret = prefix;
  if (varList.length) {
    ret +=
      "(" +
      varList
        .map(([name, { type: kind, variable }]) => {
          let type = kind.array ? "[" : "";
          type += kind.type;
          if (kind.isRequired) type += "!";
          if (kind.array) type += kind.array.isRequired ? "]!" : "]";

          if (!type.endsWith("!") && (variable as any).isRequired === true) {
            type += "!";
          }

          return "$" + name + ":" + type;
        })
        .join(",") +
      ")";
  }
  ret += queryBody;

  return ret;
}

export type OutputTypeOf<T> =
  T extends $Interface<infer Subtypes, any>
    ? { [K in keyof Subtypes]: OutputTypeOf<Subtypes[K]> }[keyof Subtypes]
    : T extends $Union<infer Subtypes, any>
      ? { [K in keyof Subtypes]: OutputTypeOf<Subtypes[K]> }[keyof Subtypes]
      : T extends $Base<any>
        ? { [K in keyof T]?: OutputTypeOf<T[K]> }
        : [T] extends [$Field<any, infer FieldType, any>]
          ? FieldType
          : [T] extends [(selFn: (arg: infer Inner) => any) => any]
            ? OutputTypeOf<Inner>
            : [T] extends [(args: any, selFn: (arg: infer Inner) => any) => any]
              ? OutputTypeOf<Inner>
              : never;

export type QueryOutputType<T extends TypedDocumentNode<any>> =
  T extends TypedDocumentNode<infer Out> ? Out : never;

export type QueryInputType<T extends TypedDocumentNode<any>> =
  T extends TypedDocumentNode<any, infer In> ? In : never;

export function fragment<T, Sel extends Selection<T>>(
  GQLType: { new (): T },
  selectFn: (selector: T) => [...Sel],
) {
  return selectFn(new GQLType());
}

type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R
    ? R
    : never;

// TS4.0+
type Push<T extends any[], V> = [...T, V];

// TS4.1+
type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

type AllFieldProperties<I> = {
  [K in keyof I]: I[K] extends $Field<infer Name, infer Type, any>
    ? $Field<Name, Type, any>
    : never;
};

type ValueOf<T> = T[keyof T];

export type AllFields<T> = TuplifyUnion<ValueOf<AllFieldProperties<T>>>;

export function all<I extends $Base<any>>(instance: I) {
  const prototype = Object.getPrototypeOf(instance);
  const allFields = Object.getOwnPropertyNames(prototype)
    .map((k) => prototype[k])
    .filter((o) => o?.kind === "field")
    .map((o) => o?.name) as (keyof typeof instance)[];
  return allFields.map(
    (fieldName) => instance?.[fieldName],
  ) as any as AllFields<I>;
}

// We use a dummy conditional type that involves GenericType to defer the compiler's inference of
// any possible variables nested in this type. This addresses a problem where variables are
// inferred with type unknown
// @ts-ignore
type ExactArgNames<GenericType, Constraint> = GenericType extends never
  ? never
  : [Constraint] extends [$Atomic | CustomScalar<any>]
    ? GenericType
    : Constraint extends ReadonlyArray<infer InnerConstraint>
      ? GenericType extends ReadonlyArray<infer Inner>
        ? ReadonlyArray<ExactArgNames<Inner, InnerConstraint>>
        : GenericType
      : GenericType & {
          [Key in keyof GenericType]: Key extends keyof Constraint
            ? ExactArgNames<GenericType[Key], Constraint[Key]>
            : never;
        };

type $Atomic =
  | ArticleOrderByInput
  | AssetOrderByInput
  | AssetUploadStatus
  | DocumentFileTypes
  | EntityTypeName
  | ImageFit
  | Locale
  | PitchOrderByInput
  | ScheduledOperationOrderByInput
  | ScheduledOperationStatus
  | ScheduledReleaseOrderByInput
  | ScheduledReleaseStatus
  | Stage
  | SystemDateTimeFieldVariation
  | UserKind
  | UserOrderByInput
  | _FilterKind
  | _MutationInputFieldKind
  | _MutationKind
  | _OrderDirection
  | _RelationInputCardinality
  | _RelationInputKind
  | _RelationKind
  | _SystemDateTimeFieldVariation
  | number
  | string
  | boolean
  | null
  | undefined;

let $Enums = new Set<string>([
  "ArticleOrderByInput",
  "AssetOrderByInput",
  "AssetUploadStatus",
  "DocumentFileTypes",
  "EntityTypeName",
  "ImageFit",
  "Locale",
  "PitchOrderByInput",
  "ScheduledOperationOrderByInput",
  "ScheduledOperationStatus",
  "ScheduledReleaseOrderByInput",
  "ScheduledReleaseStatus",
  "Stage",
  "SystemDateTimeFieldVariation",
  "UserKind",
  "UserOrderByInput",
  "_FilterKind",
  "_MutationInputFieldKind",
  "_MutationKind",
  "_OrderDirection",
  "_RelationInputCardinality",
  "_RelationInputKind",
  "_RelationKind",
  "_SystemDateTimeFieldVariation",
]);

export class Aggregate extends $Base<"Aggregate"> {
  constructor() {
    super("Aggregate");
  }

  get count(): $Field<"count", number> {
    return this.$_select("count") as any;
  }
}

export class Article extends $Base<"Article"> {
  constructor() {
    super("Article");
  }

  content<Sel extends Selection<RichText>>(
    selectorFn: (s: RichText) => [...Sel],
  ): $Field<"content", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new RichText()),
    };
    return this.$_select("content", options as any) as any;
  }

  /**
   * The time the document was created
   */
  get createdAt(): $Field<"createdAt", DateTime> {
    return this.$_select("createdAt") as any;
  }

  /**
   * User that created this document
   */
  createdBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"createdBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  createdBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"createdBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  createdBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("createdBy", options as any) as any;
  }

  /**
   * Get the document in other stages
   */
  documentInStages<
    Args extends VariabledInput<{
      includeCurrent?: boolean;
      inheritLocale?: boolean;
      stages?: Readonly<Array<Stage>>;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        includeCurrent?: boolean;
        inheritLocale?: boolean;
        stages?: Readonly<Array<Stage>>;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<
    "documentInStages",
    Array<GetOutput<Sel>>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        includeCurrent: "Boolean!",
        inheritLocale: "Boolean!",
        stages: "[Stage!]!",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("documentInStages", options as any) as any;
  }

  /**
   * List of Article versions
   */
  history<
    Args extends VariabledInput<{
      limit?: number;
      skip?: number;
      stageOverride?: Stage | null;
    }>,
    Sel extends Selection<Version>,
  >(
    args: ExactArgNames<
      Args,
      {
        limit?: number;
        skip?: number;
        stageOverride?: Stage | null;
      }
    >,
    selectorFn: (s: Version) => [...Sel],
  ): $Field<"history", Array<GetOutput<Sel>>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        limit: "Int!",
        skip: "Int!",
        stageOverride: "Stage",
      },
      args,

      selection: selectorFn(new Version()),
    };
    return this.$_select("history", options as any) as any;
  }

  /**
   * The unique identifier
   */
  get id(): $Field<"id", string> {
    return this.$_select("id") as any;
  }

  /**
   * The time the document was published. Null on documents in draft stage.
   */
  get publishedAt(): $Field<"publishedAt", DateTime | null> {
    return this.$_select("publishedAt") as any;
  }

  /**
   * User that last published this document
   */
  publishedBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"publishedBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  publishedBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"publishedBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  publishedBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("publishedBy", options as any) as any;
  }

  scheduledIn<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      forceParentLocale?: boolean | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>> | null;
      skip?: number | null;
      where?: ScheduledOperationWhereInput | null;
    }>,
    Sel extends Selection<ScheduledOperation>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        forceParentLocale?: boolean | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>> | null;
        skip?: number | null;
        where?: ScheduledOperationWhereInput | null;
      }
    >,
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<"scheduledIn", Array<GetOutput<Sel>>, GetVariables<Sel, Args>>;
  scheduledIn<Sel extends Selection<ScheduledOperation>>(
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<"scheduledIn", Array<GetOutput<Sel>>, GetVariables<Sel>>;
  scheduledIn(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        forceParentLocale: "Boolean",
        last: "Int",
        locales: "[Locale!]",
        skip: "Int",
        where: "ScheduledOperationWhereInput",
      },
      args,

      selection: selectorFn(new ScheduledOperation()),
    };
    return this.$_select("scheduledIn", options as any) as any;
  }

  get slug(): $Field<"slug", string> {
    return this.$_select("slug") as any;
  }

  /**
   * System stage field
   */
  get stage(): $Field<"stage", Stage> {
    return this.$_select("stage") as any;
  }

  get tags(): $Field<"tags", Readonly<Array<string>>> {
    return this.$_select("tags") as any;
  }

  get title(): $Field<"title", string> {
    return this.$_select("title") as any;
  }

  /**
   * The time the document was updated
   */
  get updatedAt(): $Field<"updatedAt", DateTime> {
    return this.$_select("updatedAt") as any;
  }

  /**
   * User that last updated this document
   */
  updatedBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"updatedBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  updatedBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"updatedBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  updatedBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("updatedBy", options as any) as any;
  }
}

export type ArticleConnectInput = {
  position?: ConnectPositionInput | null;
  where: ArticleWhereUniqueInput;
};

/**
 * A connection to a list of items.
 */
export class ArticleConnection extends $Base<"ArticleConnection"> {
  constructor() {
    super("ArticleConnection");
  }

  aggregate<Sel extends Selection<Aggregate>>(
    selectorFn: (s: Aggregate) => [...Sel],
  ): $Field<"aggregate", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new Aggregate()),
    };
    return this.$_select("aggregate", options as any) as any;
  }

  /**
   * A list of edges.
   */
  edges<Sel extends Selection<ArticleEdge>>(
    selectorFn: (s: ArticleEdge) => [...Sel],
  ): $Field<"edges", Array<GetOutput<Sel>>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new ArticleEdge()),
    };
    return this.$_select("edges", options as any) as any;
  }

  /**
   * Information to aid in pagination.
   */
  pageInfo<Sel extends Selection<PageInfo>>(
    selectorFn: (s: PageInfo) => [...Sel],
  ): $Field<"pageInfo", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new PageInfo()),
    };
    return this.$_select("pageInfo", options as any) as any;
  }
}

export type ArticleCreateInput = {
  content: RichTextAST;
  createdAt?: DateTime | null;
  slug: string;
  tags?: Readonly<Array<string>> | null;
  title: string;
  updatedAt?: DateTime | null;
};

export type ArticleCreateManyInlineInput = {
  connect?: Readonly<Array<ArticleWhereUniqueInput>> | null;
  create?: Readonly<Array<ArticleCreateInput>> | null;
};

export type ArticleCreateOneInlineInput = {
  connect?: ArticleWhereUniqueInput | null;
  create?: ArticleCreateInput | null;
};

/**
 * An edge in a connection.
 */
export class ArticleEdge extends $Base<"ArticleEdge"> {
  constructor() {
    super("ArticleEdge");
  }

  /**
   * A cursor for use in pagination.
   */
  get cursor(): $Field<"cursor", string> {
    return this.$_select("cursor") as any;
  }

  /**
   * The item at the end of the edge.
   */
  node<Sel extends Selection<Article>>(
    selectorFn: (s: Article) => [...Sel],
  ): $Field<"node", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new Article()),
    };
    return this.$_select("node", options as any) as any;
  }
}

/**
 * Identifies documents
 */
export type ArticleManyWhereInput = {
  AND?: Readonly<Array<ArticleWhereInput>> | null;
  NOT?: Readonly<Array<ArticleWhereInput>> | null;
  OR?: Readonly<Array<ArticleWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  createdBy?: UserWhereInput | null;
  documentInStages_every?: ArticleWhereStageInput | null;
  documentInStages_none?: ArticleWhereStageInput | null;
  documentInStages_some?: ArticleWhereStageInput | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  publishedBy?: UserWhereInput | null;
  scheduledIn_every?: ScheduledOperationWhereInput | null;
  scheduledIn_none?: ScheduledOperationWhereInput | null;
  scheduledIn_some?: ScheduledOperationWhereInput | null;
  slug?: string | null;
  slug_contains?: string | null;
  slug_ends_with?: string | null;
  slug_in?: Readonly<Array<string | null>> | null;
  slug_not?: string | null;
  slug_not_contains?: string | null;
  slug_not_ends_with?: string | null;
  slug_not_in?: Readonly<Array<string | null>> | null;
  slug_not_starts_with?: string | null;
  slug_starts_with?: string | null;
  tags?: Readonly<Array<string>> | null;
  tags_contains_all?: Readonly<Array<string>> | null;
  tags_contains_none?: Readonly<Array<string>> | null;
  tags_contains_some?: Readonly<Array<string>> | null;
  tags_not?: Readonly<Array<string>> | null;
  title?: string | null;
  title_contains?: string | null;
  title_ends_with?: string | null;
  title_in?: Readonly<Array<string | null>> | null;
  title_not?: string | null;
  title_not_contains?: string | null;
  title_not_ends_with?: string | null;
  title_not_in?: Readonly<Array<string | null>> | null;
  title_not_starts_with?: string | null;
  title_starts_with?: string | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedBy?: UserWhereInput | null;
};

export enum ArticleOrderByInput {
  createdAt_ASC = "createdAt_ASC",

  createdAt_DESC = "createdAt_DESC",

  id_ASC = "id_ASC",

  id_DESC = "id_DESC",

  publishedAt_ASC = "publishedAt_ASC",

  publishedAt_DESC = "publishedAt_DESC",

  slug_ASC = "slug_ASC",

  slug_DESC = "slug_DESC",

  tags_ASC = "tags_ASC",

  tags_DESC = "tags_DESC",

  title_ASC = "title_ASC",

  title_DESC = "title_DESC",

  updatedAt_ASC = "updatedAt_ASC",

  updatedAt_DESC = "updatedAt_DESC",
}

export type ArticleUpdateInput = {
  content?: RichTextAST | null;
  slug?: string | null;
  tags?: Readonly<Array<string>> | null;
  title?: string | null;
};

export type ArticleUpdateManyInlineInput = {
  connect?: Readonly<Array<ArticleConnectInput>> | null;
  create?: Readonly<Array<ArticleCreateInput>> | null;
  delete?: Readonly<Array<ArticleWhereUniqueInput>> | null;
  disconnect?: Readonly<Array<ArticleWhereUniqueInput>> | null;
  set?: Readonly<Array<ArticleWhereUniqueInput>> | null;
  update?: Readonly<Array<ArticleUpdateWithNestedWhereUniqueInput>> | null;
  upsert?: Readonly<Array<ArticleUpsertWithNestedWhereUniqueInput>> | null;
};

export type ArticleUpdateManyInput = {
  content?: RichTextAST | null;
  tags?: Readonly<Array<string>> | null;
  title?: string | null;
};

export type ArticleUpdateManyWithNestedWhereInput = {
  data: ArticleUpdateManyInput;
  where: ArticleWhereInput;
};

export type ArticleUpdateOneInlineInput = {
  connect?: ArticleWhereUniqueInput | null;
  create?: ArticleCreateInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: ArticleUpdateWithNestedWhereUniqueInput | null;
  upsert?: ArticleUpsertWithNestedWhereUniqueInput | null;
};

export type ArticleUpdateWithNestedWhereUniqueInput = {
  data: ArticleUpdateInput;
  where: ArticleWhereUniqueInput;
};

export type ArticleUpsertInput = {
  create: ArticleCreateInput;
  update: ArticleUpdateInput;
};

export type ArticleUpsertWithNestedWhereUniqueInput = {
  data: ArticleUpsertInput;
  where: ArticleWhereUniqueInput;
};

/**
 * This contains a set of filters that can be used to compare values internally
 */
export type ArticleWhereComparatorInput = {
  outdated_to?: boolean | null;
};

/**
 * Identifies documents
 */
export type ArticleWhereInput = {
  AND?: Readonly<Array<ArticleWhereInput>> | null;
  NOT?: Readonly<Array<ArticleWhereInput>> | null;
  OR?: Readonly<Array<ArticleWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  createdBy?: UserWhereInput | null;
  documentInStages_every?: ArticleWhereStageInput | null;
  documentInStages_none?: ArticleWhereStageInput | null;
  documentInStages_some?: ArticleWhereStageInput | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  publishedBy?: UserWhereInput | null;
  scheduledIn_every?: ScheduledOperationWhereInput | null;
  scheduledIn_none?: ScheduledOperationWhereInput | null;
  scheduledIn_some?: ScheduledOperationWhereInput | null;
  slug?: string | null;
  slug_contains?: string | null;
  slug_ends_with?: string | null;
  slug_in?: Readonly<Array<string | null>> | null;
  slug_not?: string | null;
  slug_not_contains?: string | null;
  slug_not_ends_with?: string | null;
  slug_not_in?: Readonly<Array<string | null>> | null;
  slug_not_starts_with?: string | null;
  slug_starts_with?: string | null;
  tags?: Readonly<Array<string>> | null;
  tags_contains_all?: Readonly<Array<string>> | null;
  tags_contains_none?: Readonly<Array<string>> | null;
  tags_contains_some?: Readonly<Array<string>> | null;
  tags_not?: Readonly<Array<string>> | null;
  title?: string | null;
  title_contains?: string | null;
  title_ends_with?: string | null;
  title_in?: Readonly<Array<string | null>> | null;
  title_not?: string | null;
  title_not_contains?: string | null;
  title_not_ends_with?: string | null;
  title_not_in?: Readonly<Array<string | null>> | null;
  title_not_starts_with?: string | null;
  title_starts_with?: string | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedBy?: UserWhereInput | null;
};

/**
 * The document in stages filter allows specifying a stage entry to cross compare the same document between different stages
 */
export type ArticleWhereStageInput = {
  AND?: Readonly<Array<ArticleWhereStageInput>> | null;
  NOT?: Readonly<Array<ArticleWhereStageInput>> | null;
  OR?: Readonly<Array<ArticleWhereStageInput>> | null;
  compareWithParent?: ArticleWhereComparatorInput | null;
  stage?: Stage | null;
};

/**
 * References Article record uniquely
 */
export type ArticleWhereUniqueInput = {
  id?: string | null;
  slug?: string | null;
};

/**
 * Asset system model
 */
export class Asset extends $Base<"Asset"> {
  constructor() {
    super("Asset");
  }

  /**
   * The time the document was created
   */
  createdAt<
    Args extends VariabledInput<{
      variation?: SystemDateTimeFieldVariation;
    }>,
  >(
    args: ExactArgNames<
      Args,
      {
        variation?: SystemDateTimeFieldVariation;
      }
    >,
  ): $Field<"createdAt", DateTime, GetVariables<[], Args>> {
    const options = {
      argTypes: {
        variation: "SystemDateTimeFieldVariation!",
      },
      args,
    };
    return this.$_select("createdAt", options as any) as any;
  }

  /**
   * User that created this document
   */
  createdBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"createdBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  createdBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"createdBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  createdBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("createdBy", options as any) as any;
  }

  /**
   * Get the document in other stages
   */
  documentInStages<
    Args extends VariabledInput<{
      includeCurrent?: boolean;
      inheritLocale?: boolean;
      stages?: Readonly<Array<Stage>>;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        includeCurrent?: boolean;
        inheritLocale?: boolean;
        stages?: Readonly<Array<Stage>>;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<
    "documentInStages",
    Array<GetOutput<Sel>>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        includeCurrent: "Boolean!",
        inheritLocale: "Boolean!",
        stages: "[Stage!]!",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("documentInStages", options as any) as any;
  }

  /**
   * The file name
   */
  get fileName(): $Field<"fileName", string> {
    return this.$_select("fileName") as any;
  }

  /**
   * The file handle
   */
  get handle(): $Field<"handle", string> {
    return this.$_select("handle") as any;
  }

  /**
   * The height of the file
   */
  get height(): $Field<"height", number | null> {
    return this.$_select("height") as any;
  }

  /**
   * List of Asset versions
   */
  history<
    Args extends VariabledInput<{
      limit?: number;
      skip?: number;
      stageOverride?: Stage | null;
    }>,
    Sel extends Selection<Version>,
  >(
    args: ExactArgNames<
      Args,
      {
        limit?: number;
        skip?: number;
        stageOverride?: Stage | null;
      }
    >,
    selectorFn: (s: Version) => [...Sel],
  ): $Field<"history", Array<GetOutput<Sel>>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        limit: "Int!",
        skip: "Int!",
        stageOverride: "Stage",
      },
      args,

      selection: selectorFn(new Version()),
    };
    return this.$_select("history", options as any) as any;
  }

  /**
   * The unique identifier
   */
  get id(): $Field<"id", string> {
    return this.$_select("id") as any;
  }

  /**
   * System Locale field
   */
  get locale(): $Field<"locale", Locale> {
    return this.$_select("locale") as any;
  }

  /**
   * Get the other localizations for this document
   */
  localizations<
    Args extends VariabledInput<{
      includeCurrent?: boolean;
      locales?: Readonly<Array<Locale>>;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        includeCurrent?: boolean;
        locales?: Readonly<Array<Locale>>;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<"localizations", Array<GetOutput<Sel>>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        includeCurrent: "Boolean!",
        locales: "[Locale!]!",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("localizations", options as any) as any;
  }

  /**
   * The mime type of the file
   */
  get mimeType(): $Field<"mimeType", string | null> {
    return this.$_select("mimeType") as any;
  }

  /**
   * The time the document was published. Null on documents in draft stage.
   */
  publishedAt<
    Args extends VariabledInput<{
      variation?: SystemDateTimeFieldVariation;
    }>,
  >(
    args: ExactArgNames<
      Args,
      {
        variation?: SystemDateTimeFieldVariation;
      }
    >,
  ): $Field<"publishedAt", DateTime | null, GetVariables<[], Args>> {
    const options = {
      argTypes: {
        variation: "SystemDateTimeFieldVariation!",
      },
      args,
    };
    return this.$_select("publishedAt", options as any) as any;
  }

  /**
   * User that last published this document
   */
  publishedBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"publishedBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  publishedBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"publishedBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  publishedBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("publishedBy", options as any) as any;
  }

  scheduledIn<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      forceParentLocale?: boolean | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>> | null;
      skip?: number | null;
      where?: ScheduledOperationWhereInput | null;
    }>,
    Sel extends Selection<ScheduledOperation>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        forceParentLocale?: boolean | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>> | null;
        skip?: number | null;
        where?: ScheduledOperationWhereInput | null;
      }
    >,
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<"scheduledIn", Array<GetOutput<Sel>>, GetVariables<Sel, Args>>;
  scheduledIn<Sel extends Selection<ScheduledOperation>>(
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<"scheduledIn", Array<GetOutput<Sel>>, GetVariables<Sel>>;
  scheduledIn(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        forceParentLocale: "Boolean",
        last: "Int",
        locales: "[Locale!]",
        skip: "Int",
        where: "ScheduledOperationWhereInput",
      },
      args,

      selection: selectorFn(new ScheduledOperation()),
    };
    return this.$_select("scheduledIn", options as any) as any;
  }

  /**
   * The file size
   */
  get size(): $Field<"size", number | null> {
    return this.$_select("size") as any;
  }

  /**
   * System stage field
   */
  get stage(): $Field<"stage", Stage> {
    return this.$_select("stage") as any;
  }

  /**
   * The time the document was updated
   */
  updatedAt<
    Args extends VariabledInput<{
      variation?: SystemDateTimeFieldVariation;
    }>,
  >(
    args: ExactArgNames<
      Args,
      {
        variation?: SystemDateTimeFieldVariation;
      }
    >,
  ): $Field<"updatedAt", DateTime, GetVariables<[], Args>> {
    const options = {
      argTypes: {
        variation: "SystemDateTimeFieldVariation!",
      },
      args,
    };
    return this.$_select("updatedAt", options as any) as any;
  }

  /**
   * User that last updated this document
   */
  updatedBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"updatedBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  updatedBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"updatedBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  updatedBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("updatedBy", options as any) as any;
  }

  /**
   * Returns information you need to upload the asset. The type of upload is dependant on what you pass into asset creations as upload type.
   */
  upload<Sel extends Selection<AssetUpload>>(
    selectorFn: (s: AssetUpload) => [...Sel],
  ): $Field<"upload", GetOutput<Sel> | null, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new AssetUpload()),
    };
    return this.$_select("upload", options as any) as any;
  }

  /**
   * Get the url for the asset with provided transformations applied.
   */
  url<
    Args extends VariabledInput<{
      transformation?: AssetTransformationInput | null;
    }>,
  >(
    args: ExactArgNames<
      Args,
      {
        transformation?: AssetTransformationInput | null;
      }
    >,
  ): $Field<"url", string, GetVariables<[], Args>> {
    const options = {
      argTypes: {
        transformation: "AssetTransformationInput",
      },
      args,
    };
    return this.$_select("url", options as any) as any;
  }

  /**
   * The file width
   */
  get width(): $Field<"width", number | null> {
    return this.$_select("width") as any;
  }
}

export type AssetConnectInput = {
  position?: ConnectPositionInput | null;
  where: AssetWhereUniqueInput;
};

/**
 * A connection to a list of items.
 */
export class AssetConnection extends $Base<"AssetConnection"> {
  constructor() {
    super("AssetConnection");
  }

  aggregate<Sel extends Selection<Aggregate>>(
    selectorFn: (s: Aggregate) => [...Sel],
  ): $Field<"aggregate", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new Aggregate()),
    };
    return this.$_select("aggregate", options as any) as any;
  }

  /**
   * A list of edges.
   */
  edges<Sel extends Selection<AssetEdge>>(
    selectorFn: (s: AssetEdge) => [...Sel],
  ): $Field<"edges", Array<GetOutput<Sel>>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new AssetEdge()),
    };
    return this.$_select("edges", options as any) as any;
  }

  /**
   * Information to aid in pagination.
   */
  pageInfo<Sel extends Selection<PageInfo>>(
    selectorFn: (s: PageInfo) => [...Sel],
  ): $Field<"pageInfo", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new PageInfo()),
    };
    return this.$_select("pageInfo", options as any) as any;
  }
}

export type AssetCreateInput = {
  createdAt?: DateTime | null;
  fileName?: string | null;
  localizations?: AssetCreateLocalizationsInput | null;
  updatedAt?: DateTime | null;
  uploadUrl?: string | null;
};

export type AssetCreateLocalizationDataInput = {
  createdAt?: DateTime | null;
  fileName?: string | null;
  updatedAt?: DateTime | null;
  uploadUrl?: string | null;
};

export type AssetCreateLocalizationInput = {
  data: AssetCreateLocalizationDataInput;
  locale: Locale;
};

export type AssetCreateLocalizationsInput = {
  create?: Readonly<Array<AssetCreateLocalizationInput>> | null;
};

export type AssetCreateManyInlineInput = {
  connect?: Readonly<Array<AssetWhereUniqueInput>> | null;
  create?: Readonly<Array<AssetCreateInput>> | null;
};

export type AssetCreateOneInlineInput = {
  connect?: AssetWhereUniqueInput | null;
  create?: AssetCreateInput | null;
};

/**
 * An edge in a connection.
 */
export class AssetEdge extends $Base<"AssetEdge"> {
  constructor() {
    super("AssetEdge");
  }

  /**
   * A cursor for use in pagination.
   */
  get cursor(): $Field<"cursor", string> {
    return this.$_select("cursor") as any;
  }

  /**
   * The item at the end of the edge.
   */
  node<Sel extends Selection<Asset>>(
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<"node", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new Asset()),
    };
    return this.$_select("node", options as any) as any;
  }
}

/**
 * Identifies documents
 */
export type AssetManyWhereInput = {
  AND?: Readonly<Array<AssetWhereInput>> | null;
  NOT?: Readonly<Array<AssetWhereInput>> | null;
  OR?: Readonly<Array<AssetWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  createdBy?: UserWhereInput | null;
  documentInStages_every?: AssetWhereStageInput | null;
  documentInStages_none?: AssetWhereStageInput | null;
  documentInStages_some?: AssetWhereStageInput | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  publishedBy?: UserWhereInput | null;
  scheduledIn_every?: ScheduledOperationWhereInput | null;
  scheduledIn_none?: ScheduledOperationWhereInput | null;
  scheduledIn_some?: ScheduledOperationWhereInput | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedBy?: UserWhereInput | null;
  upload?: AssetUploadWhereInput | null;
};

export enum AssetOrderByInput {
  createdAt_ASC = "createdAt_ASC",

  createdAt_DESC = "createdAt_DESC",

  fileName_ASC = "fileName_ASC",

  fileName_DESC = "fileName_DESC",

  handle_ASC = "handle_ASC",

  handle_DESC = "handle_DESC",

  height_ASC = "height_ASC",

  height_DESC = "height_DESC",

  id_ASC = "id_ASC",

  id_DESC = "id_DESC",

  mimeType_ASC = "mimeType_ASC",

  mimeType_DESC = "mimeType_DESC",

  publishedAt_ASC = "publishedAt_ASC",

  publishedAt_DESC = "publishedAt_DESC",

  size_ASC = "size_ASC",

  size_DESC = "size_DESC",

  updatedAt_ASC = "updatedAt_ASC",

  updatedAt_DESC = "updatedAt_DESC",

  width_ASC = "width_ASC",

  width_DESC = "width_DESC",
}

/**
 * Identifies documents
 */
export type AssetSingleRelationWhereInput = {
  AND?: Readonly<Array<AssetSingleRelationWhereInput>> | null;
  NOT?: Readonly<Array<AssetSingleRelationWhereInput>> | null;
  OR?: Readonly<Array<AssetSingleRelationWhereInput>> | null;
  upload?: AssetUploadWhereInput | null;
};

/**
 * Transformations for Assets
 */
export type AssetTransformationInput = {
  document?: DocumentTransformationInput | null;
  image?: ImageTransformationInput | null;
  validateOptions?: boolean | null;
};

export type AssetUpdateInput = {
  fileName?: string | null;
  localizations?: AssetUpdateLocalizationsInput | null;
  reUpload?: boolean | null;
  uploadUrl?: string | null;
};

export type AssetUpdateLocalizationDataInput = {
  fileName?: string | null;
  reUpload?: boolean | null;
  uploadUrl?: string | null;
};

export type AssetUpdateLocalizationInput = {
  data: AssetUpdateLocalizationDataInput;
  locale: Locale;
};

export type AssetUpdateLocalizationsInput = {
  create?: Readonly<Array<AssetCreateLocalizationInput>> | null;
  delete?: Readonly<Array<Locale>> | null;
  update?: Readonly<Array<AssetUpdateLocalizationInput>> | null;
  upsert?: Readonly<Array<AssetUpsertLocalizationInput>> | null;
};

export type AssetUpdateManyInlineInput = {
  connect?: Readonly<Array<AssetConnectInput>> | null;
  create?: Readonly<Array<AssetCreateInput>> | null;
  delete?: Readonly<Array<AssetWhereUniqueInput>> | null;
  disconnect?: Readonly<Array<AssetWhereUniqueInput>> | null;
  set?: Readonly<Array<AssetWhereUniqueInput>> | null;
  update?: Readonly<Array<AssetUpdateWithNestedWhereUniqueInput>> | null;
  upsert?: Readonly<Array<AssetUpsertWithNestedWhereUniqueInput>> | null;
};

export type AssetUpdateManyInput = {
  _?: string | null;
};

export type AssetUpdateManyWithNestedWhereInput = {
  data: AssetUpdateManyInput;
  where: AssetWhereInput;
};

export type AssetUpdateOneInlineInput = {
  connect?: AssetWhereUniqueInput | null;
  create?: AssetCreateInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: AssetUpdateWithNestedWhereUniqueInput | null;
  upsert?: AssetUpsertWithNestedWhereUniqueInput | null;
};

export type AssetUpdateWithNestedWhereUniqueInput = {
  data: AssetUpdateInput;
  where: AssetWhereUniqueInput;
};

/**
 * Asset Upload
 */
export class AssetUpload extends $Base<"AssetUpload"> {
  constructor() {
    super("AssetUpload");
  }

  /**
   * Asset Upload Error
   */
  error<Sel extends Selection<AssetUploadError>>(
    selectorFn: (s: AssetUploadError) => [...Sel],
  ): $Field<"error", GetOutput<Sel> | null, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new AssetUploadError()),
    };
    return this.$_select("error", options as any) as any;
  }

  /**
   * Expiry Timestamp
   */
  get expiresAt(): $Field<"expiresAt", DateTime | null> {
    return this.$_select("expiresAt") as any;
  }

  /**
   * Asset Request Data for upload
   */
  requestPostData<Sel extends Selection<AssetUploadRequestPostData>>(
    selectorFn: (s: AssetUploadRequestPostData) => [...Sel],
  ): $Field<"requestPostData", GetOutput<Sel> | null, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new AssetUploadRequestPostData()),
    };
    return this.$_select("requestPostData", options as any) as any;
  }

  /**
   * Asset Request Data for upload
   */
  get status(): $Field<"status", AssetUploadStatus | null> {
    return this.$_select("status") as any;
  }
}

/**
 * Represents asset upload error
 */
export class AssetUploadError extends $Base<"AssetUploadError"> {
  constructor() {
    super("AssetUploadError");
  }

  get code(): $Field<"code", string> {
    return this.$_select("code") as any;
  }

  get message(): $Field<"message", string> {
    return this.$_select("message") as any;
  }
}

/**
 * Asset Upload Request Post Data
 */
export class AssetUploadRequestPostData extends $Base<"AssetUploadRequestPostData"> {
  constructor() {
    super("AssetUploadRequestPostData");
  }

  /**
   * The algorithm to use in the form field. This value should be passed in the `X-Amz-Algorithm` form field.
   */
  get algorithm(): $Field<"algorithm", string> {
    return this.$_select("algorithm") as any;
  }

  /**
   * The credential to use in the form field. This value should be passed in the `X-Amz-Credential` form field.
   */
  get credential(): $Field<"credential", string> {
    return this.$_select("credential") as any;
  }

  /**
   * The date the request was signed, formatted as YYYYMMDDTHHMMSSZ. This value should be passed in the `X-Amz-Date` header.
   */
  get date(): $Field<"date", string> {
    return this.$_select("date") as any;
  }

  /**
   * The key to use in the form field. This value should be passed in the `Key` form field.
   */
  get key(): $Field<"key", string> {
    return this.$_select("key") as any;
  }

  /**
   * The policy to use in the form field. This value should be passed in the `Policy` form field.
   */
  get policy(): $Field<"policy", string> {
    return this.$_select("policy") as any;
  }

  /**
   * The security token to use in the form field. This field is optional only pass it if its not null. This value should be passed in the `X-Amz-Security-Token` form field if not null.
   */
  get securityToken(): $Field<"securityToken", string | null> {
    return this.$_select("securityToken") as any;
  }

  /**
   * The signature to use in the form field. This value should be passed in the `X-Amz-Signature` form field.
   */
  get signature(): $Field<"signature", string> {
    return this.$_select("signature") as any;
  }

  /**
   * The URL to which the file should be uploaded with a POST request.
   */
  get url(): $Field<"url", string> {
    return this.$_select("url") as any;
  }
}

/**
 * System Asset Upload Status
 */
export enum AssetUploadStatus {
  ASSET_CREATE_PENDING = "ASSET_CREATE_PENDING",

  ASSET_ERROR_UPLOAD = "ASSET_ERROR_UPLOAD",

  ASSET_UPDATE_PENDING = "ASSET_UPDATE_PENDING",

  ASSET_UPLOAD_COMPLETE = "ASSET_UPLOAD_COMPLETE",
}

/**
 * Identifies documents
 */
export type AssetUploadWhereInput = {
  AND?: Readonly<Array<AssetUploadWhereInput>> | null;
  NOT?: Readonly<Array<AssetUploadWhereInput>> | null;
  OR?: Readonly<Array<AssetUploadWhereInput>> | null;
  expiresAt?: DateTime | null;
  expiresAt_gt?: DateTime | null;
  expiresAt_gte?: DateTime | null;
  expiresAt_in?: Readonly<Array<DateTime | null>> | null;
  expiresAt_lt?: DateTime | null;
  expiresAt_lte?: DateTime | null;
  expiresAt_not?: DateTime | null;
  expiresAt_not_in?: Readonly<Array<DateTime | null>> | null;
  status?: AssetUploadStatus | null;
  status_in?: Readonly<Array<AssetUploadStatus | null>> | null;
  status_not?: AssetUploadStatus | null;
  status_not_in?: Readonly<Array<AssetUploadStatus | null>> | null;
};

/**
 * Identifies documents
 */
export type AssetUploadWhereStageInput = {
  AND?: Readonly<Array<AssetUploadWhereInput>> | null;
  NOT?: Readonly<Array<AssetUploadWhereInput>> | null;
  OR?: Readonly<Array<AssetUploadWhereInput>> | null;
  expiresAt?: DateTime | null;
  expiresAt_gt?: DateTime | null;
  expiresAt_gte?: DateTime | null;
  expiresAt_in?: Readonly<Array<DateTime | null>> | null;
  expiresAt_lt?: DateTime | null;
  expiresAt_lte?: DateTime | null;
  expiresAt_not?: DateTime | null;
  expiresAt_not_in?: Readonly<Array<DateTime | null>> | null;
  status?: AssetUploadStatus | null;
  status_in?: Readonly<Array<AssetUploadStatus | null>> | null;
  status_not?: AssetUploadStatus | null;
  status_not_in?: Readonly<Array<AssetUploadStatus | null>> | null;
};

export type AssetUpsertInput = {
  create: AssetCreateInput;
  update: AssetUpdateInput;
};

export type AssetUpsertLocalizationInput = {
  create: AssetCreateLocalizationDataInput;
  locale: Locale;
  update: AssetUpdateLocalizationDataInput;
};

export type AssetUpsertWithNestedWhereUniqueInput = {
  data: AssetUpsertInput;
  where: AssetWhereUniqueInput;
};

/**
 * This contains a set of filters that can be used to compare values internally
 */
export type AssetWhereComparatorInput = {
  outdated_to?: boolean | null;
};

/**
 * Identifies documents
 */
export type AssetWhereInput = {
  AND?: Readonly<Array<AssetWhereInput>> | null;
  NOT?: Readonly<Array<AssetWhereInput>> | null;
  OR?: Readonly<Array<AssetWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  createdBy?: UserWhereInput | null;
  documentInStages_every?: AssetWhereStageInput | null;
  documentInStages_none?: AssetWhereStageInput | null;
  documentInStages_some?: AssetWhereStageInput | null;
  fileName?: string | null;
  fileName_contains?: string | null;
  fileName_ends_with?: string | null;
  fileName_in?: Readonly<Array<string | null>> | null;
  fileName_not?: string | null;
  fileName_not_contains?: string | null;
  fileName_not_ends_with?: string | null;
  fileName_not_in?: Readonly<Array<string | null>> | null;
  fileName_not_starts_with?: string | null;
  fileName_starts_with?: string | null;
  handle?: string | null;
  handle_contains?: string | null;
  handle_ends_with?: string | null;
  handle_in?: Readonly<Array<string | null>> | null;
  handle_not?: string | null;
  handle_not_contains?: string | null;
  handle_not_ends_with?: string | null;
  handle_not_in?: Readonly<Array<string | null>> | null;
  handle_not_starts_with?: string | null;
  handle_starts_with?: string | null;
  height?: number | null;
  height_gt?: number | null;
  height_gte?: number | null;
  height_in?: Readonly<Array<number | null>> | null;
  height_lt?: number | null;
  height_lte?: number | null;
  height_not?: number | null;
  height_not_in?: Readonly<Array<number | null>> | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  mimeType?: string | null;
  mimeType_contains?: string | null;
  mimeType_ends_with?: string | null;
  mimeType_in?: Readonly<Array<string | null>> | null;
  mimeType_not?: string | null;
  mimeType_not_contains?: string | null;
  mimeType_not_ends_with?: string | null;
  mimeType_not_in?: Readonly<Array<string | null>> | null;
  mimeType_not_starts_with?: string | null;
  mimeType_starts_with?: string | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  publishedBy?: UserWhereInput | null;
  scheduledIn_every?: ScheduledOperationWhereInput | null;
  scheduledIn_none?: ScheduledOperationWhereInput | null;
  scheduledIn_some?: ScheduledOperationWhereInput | null;
  size?: number | null;
  size_gt?: number | null;
  size_gte?: number | null;
  size_in?: Readonly<Array<number | null>> | null;
  size_lt?: number | null;
  size_lte?: number | null;
  size_not?: number | null;
  size_not_in?: Readonly<Array<number | null>> | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedBy?: UserWhereInput | null;
  upload?: AssetUploadWhereInput | null;
  width?: number | null;
  width_gt?: number | null;
  width_gte?: number | null;
  width_in?: Readonly<Array<number | null>> | null;
  width_lt?: number | null;
  width_lte?: number | null;
  width_not?: number | null;
  width_not_in?: Readonly<Array<number | null>> | null;
};

/**
 * The document in stages filter allows specifying a stage entry to cross compare the same document between different stages
 */
export type AssetWhereStageInput = {
  AND?: Readonly<Array<AssetWhereStageInput>> | null;
  NOT?: Readonly<Array<AssetWhereStageInput>> | null;
  OR?: Readonly<Array<AssetWhereStageInput>> | null;
  compareWithParent?: AssetWhereComparatorInput | null;
  stage?: Stage | null;
};

/**
 * References Asset record uniquely
 */
export type AssetWhereUniqueInput = {
  id?: string | null;
};

export class BatchPayload extends $Base<"BatchPayload"> {
  constructor() {
    super("BatchPayload");
  }

  /**
   * The number of nodes that have been affected by the Batch operation.
   */
  get count(): $Field<"count", Long> {
    return this.$_select("count") as any;
  }
}

/**
 * Representing a color value comprising of HEX, RGBA and css color values
 */
export class Color extends $Base<"Color"> {
  constructor() {
    super("Color");
  }

  get css(): $Field<"css", string> {
    return this.$_select("css") as any;
  }

  get hex(): $Field<"hex", Hex> {
    return this.$_select("hex") as any;
  }

  rgba<Sel extends Selection<RGBA>>(
    selectorFn: (s: RGBA) => [...Sel],
  ): $Field<"rgba", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new RGBA()),
    };
    return this.$_select("rgba", options as any) as any;
  }
}

/**
 * Accepts either HEX or RGBA color value. At least one of hex or rgba value should be passed. If both are passed RGBA is used.
 */
export type ColorInput = {
  hex?: Hex | null;
  rgba?: RGBAInput | null;
};

export type ConnectPositionInput = {
  after?: string | null;
  before?: string | null;
  end?: boolean | null;
  start?: boolean | null;
};

/**
 * A date string, such as 2007-12-03 (YYYY-MM-DD), compliant with ISO 8601 standard for representation of dates using the Gregorian calendar.
 */
export type Date = string;

/**
 * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the date-timeformat outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representationof dates and times using the Gregorian calendar.
 */
export type DateTime = string;

export enum DocumentFileTypes {
  /**
   * Automatically selects the best format for the image based on the browser's capabilities.
   */
  autoImage = "autoImage",

  avif = "avif",

  bmp = "bmp",

  gif = "gif",

  heic = "heic",

  jpg = "jpg",

  png = "png",

  svg = "svg",

  tiff = "tiff",

  webp = "webp",
}

export type DocumentOutputInput = {
  format?: DocumentFileTypes | null;
};

/**
 * Transformations for Documents
 */
export type DocumentTransformationInput = {
  output?: DocumentOutputInput | null;
};

export class DocumentVersion extends $Base<"DocumentVersion"> {
  constructor() {
    super("DocumentVersion");
  }

  get createdAt(): $Field<"createdAt", DateTime> {
    return this.$_select("createdAt") as any;
  }

  get data(): $Field<"data", Json | null> {
    return this.$_select("data") as any;
  }

  get id(): $Field<"id", string> {
    return this.$_select("id") as any;
  }

  get revision(): $Field<"revision", number> {
    return this.$_select("revision") as any;
  }

  get stage(): $Field<"stage", Stage> {
    return this.$_select("stage") as any;
  }
}

/**
 * An object with an ID
 */
export class Entity extends $Interface<
  {
    Article: Article;
    Asset: Asset;
    Pitch: Pitch;
    ScheduledOperation: ScheduledOperation;
    ScheduledRelease: ScheduledRelease;
    User: User;
  },
  "Entity"
> {
  constructor() {
    super(
      {
        Article: Article,
        Asset: Asset,
        Pitch: Pitch,
        ScheduledOperation: ScheduledOperation,
        ScheduledRelease: ScheduledRelease,
        User: User,
      },
      "Entity",
    );
  }

  /**
   * The id of the object.
   */
  get id(): $Field<"id", string> {
    return this.$_select("id") as any;
  }

  /**
   * The Stage of an object
   */
  get stage(): $Field<"stage", Stage> {
    return this.$_select("stage") as any;
  }
}

/**
 * This enumeration holds all typenames that implement the Entity interface. Components and models implement the Entity interface.
 */
export enum EntityTypeName {
  Article = "Article",

  /**
   * Asset system model
   */
  Asset = "Asset",

  Pitch = "Pitch",

  /**
   * Scheduled Operation system model
   */
  ScheduledOperation = "ScheduledOperation",

  /**
   * Scheduled Release system model
   */
  ScheduledRelease = "ScheduledRelease",

  /**
   * User system model
   */
  User = "User",
}

/**
 * Allows to specify input to query models and components directly
 */
export type EntityWhereInput = {
  id: string;
  locale?: Locale | null;
  stage: Stage;
  typename: EntityTypeName;
};

export type Hex = string;

export type ImageBlurInput = {
  amount: number;
};

/**
 * Adds a border to the image.
 */
export type ImageBorderInput = {
  background: string;
  color: string;
  width: number;
};

export type ImageCompressInput = {
  metadata: boolean;
};

/**
 * Crops the image to the specified dimensions.
The starting points for X and Y coordinates are [0,0], aligning with the top-left corner of the image.
The width and height parameters determine the size in pixels of the cropping rectangle.
The output will include only the portion of the image within the designated crop area.
 */
export type ImageCropInput = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export enum ImageFit {
  /**
   * Resizes the image to fit within the specified parameters without distorting, cropping, or changing the aspect ratio.
   */
  clip = "clip",

  /**
   * Resizes the image to fit the specified parameters exactly by removing any parts of the image that don't fit within the boundaries.
   */
  crop = "crop",

  /**
   * Resizes the image to fit within the parameters, but as opposed to 'fit:clip' will not scale the image if the image is smaller than the output size.
   */
  max = "max",

  /**
   * Resizes the image to fit the specified parameters exactly by scaling the image to the desired size. The aspect ratio of the image is not respected and the image can be distorted using this method.
   */
  scale = "scale",
}

export type ImageQualityInput = {
  value: number;
};

export type ImageResizeInput = {
  fit?: ImageFit | null;
  height?: number | null;
  width?: number | null;
};

export type ImageSharpenInput = {
  amount: number;
};

/**
 * Transformations for Images
 */
export type ImageTransformationInput = {
  blur?: ImageBlurInput | null;
  border?: ImageBorderInput | null;
  compress?: ImageCompressInput | null;
  crop?: ImageCropInput | null;
  quality?: ImageQualityInput | null;
  resize?: ImageResizeInput | null;
  sharpen?: ImageSharpenInput | null;
};

/**
 * Raw JSON value
 */
export type Json = string;

/**
 * Locale system enumeration
 */
export enum Locale {
  /**
   * System locale
   */
  en = "en",
}

/**
 * Representing a geolocation point with latitude and longitude
 */
export class Location extends $Base<"Location"> {
  constructor() {
    super("Location");
  }

  distance<
    Args extends VariabledInput<{
      from: LocationInput;
    }>,
  >(
    args: ExactArgNames<
      Args,
      {
        from: LocationInput;
      }
    >,
  ): $Field<"distance", number, GetVariables<[], Args>> {
    const options = {
      argTypes: {
        from: "LocationInput!",
      },
      args,
    };
    return this.$_select("distance", options as any) as any;
  }

  get latitude(): $Field<"latitude", number> {
    return this.$_select("latitude") as any;
  }

  get longitude(): $Field<"longitude", number> {
    return this.$_select("longitude") as any;
  }
}

/**
 * Input for a geolocation point with latitude and longitude
 */
export type LocationInput = {
  latitude: number;
  longitude: number;
};

/**
 * The Long scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^63) and 2^63 - 1.
 */
export type Long = string;

export class Mutation extends $Base<"Mutation"> {
  constructor() {
    super("Mutation");
  }

  /**
   * Create one article
   */
  createArticle<
    Args extends VariabledInput<{
      data: ArticleCreateInput;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: ArticleCreateInput;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<"createArticle", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        data: "ArticleCreateInput!",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("createArticle", options as any) as any;
  }

  /**
   * Create an asset. Use the returned info to finish the creation process by uploading the asset.
   */
  createAsset<
    Args extends VariabledInput<{
      data: AssetCreateInput;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: AssetCreateInput;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<"createAsset", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        data: "AssetCreateInput!",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("createAsset", options as any) as any;
  }

  /**
   * Create one pitch
   */
  createPitch<
    Args extends VariabledInput<{
      data: PitchCreateInput;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: PitchCreateInput;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<"createPitch", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        data: "PitchCreateInput!",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("createPitch", options as any) as any;
  }

  /**
   * Create one scheduledRelease
   */
  createScheduledRelease<
    Args extends VariabledInput<{
      data: ScheduledReleaseCreateInput;
    }>,
    Sel extends Selection<ScheduledRelease>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: ScheduledReleaseCreateInput;
      }
    >,
    selectorFn: (s: ScheduledRelease) => [...Sel],
  ): $Field<
    "createScheduledRelease",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        data: "ScheduledReleaseCreateInput!",
      },
      args,

      selection: selectorFn(new ScheduledRelease()),
    };
    return this.$_select("createScheduledRelease", options as any) as any;
  }

  /**
   * Delete one article from _all_ existing stages. Returns deleted document.
   */
  deleteArticle<
    Args extends VariabledInput<{
      where: ArticleWhereUniqueInput;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        where: ArticleWhereUniqueInput;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<"deleteArticle", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        where: "ArticleWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("deleteArticle", options as any) as any;
  }

  /**
   * Delete one asset from _all_ existing stages. Returns deleted document.
   */
  deleteAsset<
    Args extends VariabledInput<{
      where: AssetWhereUniqueInput;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        where: AssetWhereUniqueInput;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<"deleteAsset", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        where: "AssetWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("deleteAsset", options as any) as any;
  }

  /**
   * Delete many Article documents
   */
  deleteManyArticles<
    Args extends VariabledInput<{
      where?: ArticleManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        where?: ArticleManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"deleteManyArticles", GetOutput<Sel>, GetVariables<Sel, Args>>;
  deleteManyArticles<Sel extends Selection<BatchPayload>>(
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"deleteManyArticles", GetOutput<Sel>, GetVariables<Sel>>;
  deleteManyArticles(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        where: "ArticleManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("deleteManyArticles", options as any) as any;
  }

  /**
   * Delete many Article documents, return deleted documents
   */
  deleteManyArticlesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      skip?: number | null;
      where?: ArticleManyWhereInput | null;
    }>,
    Sel extends Selection<ArticleConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        skip?: number | null;
        where?: ArticleManyWhereInput | null;
      }
    >,
    selectorFn: (s: ArticleConnection) => [...Sel],
  ): $Field<
    "deleteManyArticlesConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  >;
  deleteManyArticlesConnection<Sel extends Selection<ArticleConnection>>(
    selectorFn: (s: ArticleConnection) => [...Sel],
  ): $Field<"deleteManyArticlesConnection", GetOutput<Sel>, GetVariables<Sel>>;
  deleteManyArticlesConnection(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        first: "Int",
        last: "Int",
        skip: "Int",
        where: "ArticleManyWhereInput",
      },
      args,

      selection: selectorFn(new ArticleConnection()),
    };
    return this.$_select("deleteManyArticlesConnection", options as any) as any;
  }

  /**
   * Delete many Asset documents
   */
  deleteManyAssets<
    Args extends VariabledInput<{
      where?: AssetManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        where?: AssetManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"deleteManyAssets", GetOutput<Sel>, GetVariables<Sel, Args>>;
  deleteManyAssets<Sel extends Selection<BatchPayload>>(
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"deleteManyAssets", GetOutput<Sel>, GetVariables<Sel>>;
  deleteManyAssets(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        where: "AssetManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("deleteManyAssets", options as any) as any;
  }

  /**
   * Delete many Asset documents, return deleted documents
   */
  deleteManyAssetsConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      skip?: number | null;
      where?: AssetManyWhereInput | null;
    }>,
    Sel extends Selection<AssetConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        skip?: number | null;
        where?: AssetManyWhereInput | null;
      }
    >,
    selectorFn: (s: AssetConnection) => [...Sel],
  ): $Field<
    "deleteManyAssetsConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  >;
  deleteManyAssetsConnection<Sel extends Selection<AssetConnection>>(
    selectorFn: (s: AssetConnection) => [...Sel],
  ): $Field<"deleteManyAssetsConnection", GetOutput<Sel>, GetVariables<Sel>>;
  deleteManyAssetsConnection(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        first: "Int",
        last: "Int",
        skip: "Int",
        where: "AssetManyWhereInput",
      },
      args,

      selection: selectorFn(new AssetConnection()),
    };
    return this.$_select("deleteManyAssetsConnection", options as any) as any;
  }

  /**
   * Delete many Pitch documents
   */
  deleteManyPitches<
    Args extends VariabledInput<{
      where?: PitchManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        where?: PitchManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"deleteManyPitches", GetOutput<Sel>, GetVariables<Sel, Args>>;
  deleteManyPitches<Sel extends Selection<BatchPayload>>(
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"deleteManyPitches", GetOutput<Sel>, GetVariables<Sel>>;
  deleteManyPitches(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        where: "PitchManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("deleteManyPitches", options as any) as any;
  }

  /**
   * Delete many Pitch documents, return deleted documents
   */
  deleteManyPitchesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      skip?: number | null;
      where?: PitchManyWhereInput | null;
    }>,
    Sel extends Selection<PitchConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        skip?: number | null;
        where?: PitchManyWhereInput | null;
      }
    >,
    selectorFn: (s: PitchConnection) => [...Sel],
  ): $Field<
    "deleteManyPitchesConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  >;
  deleteManyPitchesConnection<Sel extends Selection<PitchConnection>>(
    selectorFn: (s: PitchConnection) => [...Sel],
  ): $Field<"deleteManyPitchesConnection", GetOutput<Sel>, GetVariables<Sel>>;
  deleteManyPitchesConnection(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        first: "Int",
        last: "Int",
        skip: "Int",
        where: "PitchManyWhereInput",
      },
      args,

      selection: selectorFn(new PitchConnection()),
    };
    return this.$_select("deleteManyPitchesConnection", options as any) as any;
  }

  /**
   * Delete one pitch from _all_ existing stages. Returns deleted document.
   */
  deletePitch<
    Args extends VariabledInput<{
      where: PitchWhereUniqueInput;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        where: PitchWhereUniqueInput;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<"deletePitch", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        where: "PitchWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("deletePitch", options as any) as any;
  }

  /**
   * Delete and return scheduled operation
   */
  deleteScheduledOperation<
    Args extends VariabledInput<{
      where: ScheduledOperationWhereUniqueInput;
    }>,
    Sel extends Selection<ScheduledOperation>,
  >(
    args: ExactArgNames<
      Args,
      {
        where: ScheduledOperationWhereUniqueInput;
      }
    >,
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<
    "deleteScheduledOperation",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        where: "ScheduledOperationWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new ScheduledOperation()),
    };
    return this.$_select("deleteScheduledOperation", options as any) as any;
  }

  /**
   * Delete one scheduledRelease from _all_ existing stages. Returns deleted document.
   */
  deleteScheduledRelease<
    Args extends VariabledInput<{
      where: ScheduledReleaseWhereUniqueInput;
    }>,
    Sel extends Selection<ScheduledRelease>,
  >(
    args: ExactArgNames<
      Args,
      {
        where: ScheduledReleaseWhereUniqueInput;
      }
    >,
    selectorFn: (s: ScheduledRelease) => [...Sel],
  ): $Field<
    "deleteScheduledRelease",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        where: "ScheduledReleaseWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new ScheduledRelease()),
    };
    return this.$_select("deleteScheduledRelease", options as any) as any;
  }

  /**
   * Publish one article
   */
  publishArticle<
    Args extends VariabledInput<{
      to?: Readonly<Array<Stage>>;
      where: ArticleWhereUniqueInput;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        to?: Readonly<Array<Stage>>;
        where: ArticleWhereUniqueInput;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<"publishArticle", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        to: "[Stage!]!",
        where: "ArticleWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("publishArticle", options as any) as any;
  }

  /**
   * Publish one asset
   */
  publishAsset<
    Args extends VariabledInput<{
      locales?: Readonly<Array<Locale>> | null;
      publishBase?: boolean | null;
      to?: Readonly<Array<Stage>>;
      where: AssetWhereUniqueInput;
      withDefaultLocale?: boolean | null;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        locales?: Readonly<Array<Locale>> | null;
        publishBase?: boolean | null;
        to?: Readonly<Array<Stage>>;
        where: AssetWhereUniqueInput;
        withDefaultLocale?: boolean | null;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<"publishAsset", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        locales: "[Locale!]",
        publishBase: "Boolean",
        to: "[Stage!]!",
        where: "AssetWhereUniqueInput!",
        withDefaultLocale: "Boolean",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("publishAsset", options as any) as any;
  }

  /**
   * Publish many Article documents
   */
  publishManyArticles<
    Args extends VariabledInput<{
      to?: Readonly<Array<Stage>>;
      where?: ArticleManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        to?: Readonly<Array<Stage>>;
        where?: ArticleManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"publishManyArticles", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        to: "[Stage!]!",
        where: "ArticleManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("publishManyArticles", options as any) as any;
  }

  /**
   * Publish many Article documents
   */
  publishManyArticlesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      from?: Stage | null;
      last?: number | null;
      skip?: number | null;
      to?: Readonly<Array<Stage>>;
      where?: ArticleManyWhereInput | null;
    }>,
    Sel extends Selection<ArticleConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        from?: Stage | null;
        last?: number | null;
        skip?: number | null;
        to?: Readonly<Array<Stage>>;
        where?: ArticleManyWhereInput | null;
      }
    >,
    selectorFn: (s: ArticleConnection) => [...Sel],
  ): $Field<
    "publishManyArticlesConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        first: "Int",
        from: "Stage",
        last: "Int",
        skip: "Int",
        to: "[Stage!]!",
        where: "ArticleManyWhereInput",
      },
      args,

      selection: selectorFn(new ArticleConnection()),
    };
    return this.$_select(
      "publishManyArticlesConnection",
      options as any,
    ) as any;
  }

  /**
   * Publish many Asset documents
   */
  publishManyAssets<
    Args extends VariabledInput<{
      locales?: Readonly<Array<Locale>> | null;
      publishBase?: boolean | null;
      to?: Readonly<Array<Stage>>;
      where?: AssetManyWhereInput | null;
      withDefaultLocale?: boolean | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        locales?: Readonly<Array<Locale>> | null;
        publishBase?: boolean | null;
        to?: Readonly<Array<Stage>>;
        where?: AssetManyWhereInput | null;
        withDefaultLocale?: boolean | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"publishManyAssets", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        locales: "[Locale!]",
        publishBase: "Boolean",
        to: "[Stage!]!",
        where: "AssetManyWhereInput",
        withDefaultLocale: "Boolean",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("publishManyAssets", options as any) as any;
  }

  /**
   * Publish many Asset documents
   */
  publishManyAssetsConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      from?: Stage | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>> | null;
      publishBase?: boolean | null;
      skip?: number | null;
      to?: Readonly<Array<Stage>>;
      where?: AssetManyWhereInput | null;
      withDefaultLocale?: boolean | null;
    }>,
    Sel extends Selection<AssetConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        from?: Stage | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>> | null;
        publishBase?: boolean | null;
        skip?: number | null;
        to?: Readonly<Array<Stage>>;
        where?: AssetManyWhereInput | null;
        withDefaultLocale?: boolean | null;
      }
    >,
    selectorFn: (s: AssetConnection) => [...Sel],
  ): $Field<
    "publishManyAssetsConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        first: "Int",
        from: "Stage",
        last: "Int",
        locales: "[Locale!]",
        publishBase: "Boolean",
        skip: "Int",
        to: "[Stage!]!",
        where: "AssetManyWhereInput",
        withDefaultLocale: "Boolean",
      },
      args,

      selection: selectorFn(new AssetConnection()),
    };
    return this.$_select("publishManyAssetsConnection", options as any) as any;
  }

  /**
   * Publish many Pitch documents
   */
  publishManyPitches<
    Args extends VariabledInput<{
      to?: Readonly<Array<Stage>>;
      where?: PitchManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        to?: Readonly<Array<Stage>>;
        where?: PitchManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"publishManyPitches", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        to: "[Stage!]!",
        where: "PitchManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("publishManyPitches", options as any) as any;
  }

  /**
   * Publish many Pitch documents
   */
  publishManyPitchesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      from?: Stage | null;
      last?: number | null;
      skip?: number | null;
      to?: Readonly<Array<Stage>>;
      where?: PitchManyWhereInput | null;
    }>,
    Sel extends Selection<PitchConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        from?: Stage | null;
        last?: number | null;
        skip?: number | null;
        to?: Readonly<Array<Stage>>;
        where?: PitchManyWhereInput | null;
      }
    >,
    selectorFn: (s: PitchConnection) => [...Sel],
  ): $Field<
    "publishManyPitchesConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        first: "Int",
        from: "Stage",
        last: "Int",
        skip: "Int",
        to: "[Stage!]!",
        where: "PitchManyWhereInput",
      },
      args,

      selection: selectorFn(new PitchConnection()),
    };
    return this.$_select("publishManyPitchesConnection", options as any) as any;
  }

  /**
   * Publish one pitch
   */
  publishPitch<
    Args extends VariabledInput<{
      to?: Readonly<Array<Stage>>;
      where: PitchWhereUniqueInput;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        to?: Readonly<Array<Stage>>;
        where: PitchWhereUniqueInput;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<"publishPitch", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        to: "[Stage!]!",
        where: "PitchWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("publishPitch", options as any) as any;
  }

  /**
   * Schedule to publish one article
   */
  schedulePublishArticle<
    Args extends VariabledInput<{
      releaseAt?: DateTime | null;
      releaseId?: string | null;
      to?: Readonly<Array<Stage>>;
      where: ArticleWhereUniqueInput;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        releaseAt?: DateTime | null;
        releaseId?: string | null;
        to?: Readonly<Array<Stage>>;
        where: ArticleWhereUniqueInput;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<
    "schedulePublishArticle",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        releaseAt: "DateTime",
        releaseId: "String",
        to: "[Stage!]!",
        where: "ArticleWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("schedulePublishArticle", options as any) as any;
  }

  /**
   * Schedule to publish one asset
   */
  schedulePublishAsset<
    Args extends VariabledInput<{
      locales?: Readonly<Array<Locale>> | null;
      publishBase?: boolean | null;
      releaseAt?: DateTime | null;
      releaseId?: string | null;
      to?: Readonly<Array<Stage>>;
      where: AssetWhereUniqueInput;
      withDefaultLocale?: boolean | null;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        locales?: Readonly<Array<Locale>> | null;
        publishBase?: boolean | null;
        releaseAt?: DateTime | null;
        releaseId?: string | null;
        to?: Readonly<Array<Stage>>;
        where: AssetWhereUniqueInput;
        withDefaultLocale?: boolean | null;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<
    "schedulePublishAsset",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        locales: "[Locale!]",
        publishBase: "Boolean",
        releaseAt: "DateTime",
        releaseId: "String",
        to: "[Stage!]!",
        where: "AssetWhereUniqueInput!",
        withDefaultLocale: "Boolean",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("schedulePublishAsset", options as any) as any;
  }

  /**
   * Schedule to publish one pitch
   */
  schedulePublishPitch<
    Args extends VariabledInput<{
      releaseAt?: DateTime | null;
      releaseId?: string | null;
      to?: Readonly<Array<Stage>>;
      where: PitchWhereUniqueInput;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        releaseAt?: DateTime | null;
        releaseId?: string | null;
        to?: Readonly<Array<Stage>>;
        where: PitchWhereUniqueInput;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<
    "schedulePublishPitch",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        releaseAt: "DateTime",
        releaseId: "String",
        to: "[Stage!]!",
        where: "PitchWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("schedulePublishPitch", options as any) as any;
  }

  /**
   * Unpublish one article from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only.
   */
  scheduleUnpublishArticle<
    Args extends VariabledInput<{
      from?: Readonly<Array<Stage>>;
      releaseAt?: DateTime | null;
      releaseId?: string | null;
      where: ArticleWhereUniqueInput;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        from?: Readonly<Array<Stage>>;
        releaseAt?: DateTime | null;
        releaseId?: string | null;
        where: ArticleWhereUniqueInput;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<
    "scheduleUnpublishArticle",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        from: "[Stage!]!",
        releaseAt: "DateTime",
        releaseId: "String",
        where: "ArticleWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("scheduleUnpublishArticle", options as any) as any;
  }

  /**
   * Unpublish one asset from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only.
   */
  scheduleUnpublishAsset<
    Args extends VariabledInput<{
      from?: Readonly<Array<Stage>>;
      locales?: Readonly<Array<Locale>> | null;
      releaseAt?: DateTime | null;
      releaseId?: string | null;
      unpublishBase?: boolean | null;
      where: AssetWhereUniqueInput;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        from?: Readonly<Array<Stage>>;
        locales?: Readonly<Array<Locale>> | null;
        releaseAt?: DateTime | null;
        releaseId?: string | null;
        unpublishBase?: boolean | null;
        where: AssetWhereUniqueInput;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<
    "scheduleUnpublishAsset",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        from: "[Stage!]!",
        locales: "[Locale!]",
        releaseAt: "DateTime",
        releaseId: "String",
        unpublishBase: "Boolean",
        where: "AssetWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("scheduleUnpublishAsset", options as any) as any;
  }

  /**
   * Unpublish one pitch from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only.
   */
  scheduleUnpublishPitch<
    Args extends VariabledInput<{
      from?: Readonly<Array<Stage>>;
      releaseAt?: DateTime | null;
      releaseId?: string | null;
      where: PitchWhereUniqueInput;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        from?: Readonly<Array<Stage>>;
        releaseAt?: DateTime | null;
        releaseId?: string | null;
        where: PitchWhereUniqueInput;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<
    "scheduleUnpublishPitch",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        from: "[Stage!]!",
        releaseAt: "DateTime",
        releaseId: "String",
        where: "PitchWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("scheduleUnpublishPitch", options as any) as any;
  }

  /**
   * Unpublish one article from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only.
   */
  unpublishArticle<
    Args extends VariabledInput<{
      from?: Readonly<Array<Stage>>;
      where: ArticleWhereUniqueInput;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        from?: Readonly<Array<Stage>>;
        where: ArticleWhereUniqueInput;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<
    "unpublishArticle",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        from: "[Stage!]!",
        where: "ArticleWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("unpublishArticle", options as any) as any;
  }

  /**
   * Unpublish one asset from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only.
   */
  unpublishAsset<
    Args extends VariabledInput<{
      from?: Readonly<Array<Stage>>;
      locales?: Readonly<Array<Locale>> | null;
      unpublishBase?: boolean | null;
      where: AssetWhereUniqueInput;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        from?: Readonly<Array<Stage>>;
        locales?: Readonly<Array<Locale>> | null;
        unpublishBase?: boolean | null;
        where: AssetWhereUniqueInput;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<"unpublishAsset", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        from: "[Stage!]!",
        locales: "[Locale!]",
        unpublishBase: "Boolean",
        where: "AssetWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("unpublishAsset", options as any) as any;
  }

  /**
   * Unpublish many Article documents
   */
  unpublishManyArticles<
    Args extends VariabledInput<{
      from?: Readonly<Array<Stage>>;
      where?: ArticleManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        from?: Readonly<Array<Stage>>;
        where?: ArticleManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"unpublishManyArticles", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        from: "[Stage!]!",
        where: "ArticleManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("unpublishManyArticles", options as any) as any;
  }

  /**
   * Find many Article documents that match criteria in specified stage and unpublish from target stages
   */
  unpublishManyArticlesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      from?: Readonly<Array<Stage>>;
      last?: number | null;
      skip?: number | null;
      stage?: Stage | null;
      where?: ArticleManyWhereInput | null;
    }>,
    Sel extends Selection<ArticleConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        from?: Readonly<Array<Stage>>;
        last?: number | null;
        skip?: number | null;
        stage?: Stage | null;
        where?: ArticleManyWhereInput | null;
      }
    >,
    selectorFn: (s: ArticleConnection) => [...Sel],
  ): $Field<
    "unpublishManyArticlesConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        first: "Int",
        from: "[Stage!]!",
        last: "Int",
        skip: "Int",
        stage: "Stage",
        where: "ArticleManyWhereInput",
      },
      args,

      selection: selectorFn(new ArticleConnection()),
    };
    return this.$_select(
      "unpublishManyArticlesConnection",
      options as any,
    ) as any;
  }

  /**
   * Unpublish many Asset documents
   */
  unpublishManyAssets<
    Args extends VariabledInput<{
      from?: Readonly<Array<Stage>>;
      locales?: Readonly<Array<Locale>> | null;
      unpublishBase?: boolean | null;
      where?: AssetManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        from?: Readonly<Array<Stage>>;
        locales?: Readonly<Array<Locale>> | null;
        unpublishBase?: boolean | null;
        where?: AssetManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"unpublishManyAssets", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        from: "[Stage!]!",
        locales: "[Locale!]",
        unpublishBase: "Boolean",
        where: "AssetManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("unpublishManyAssets", options as any) as any;
  }

  /**
   * Find many Asset documents that match criteria in specified stage and unpublish from target stages
   */
  unpublishManyAssetsConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      from?: Readonly<Array<Stage>>;
      last?: number | null;
      locales?: Readonly<Array<Locale>> | null;
      skip?: number | null;
      stage?: Stage | null;
      unpublishBase?: boolean | null;
      where?: AssetManyWhereInput | null;
    }>,
    Sel extends Selection<AssetConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        from?: Readonly<Array<Stage>>;
        last?: number | null;
        locales?: Readonly<Array<Locale>> | null;
        skip?: number | null;
        stage?: Stage | null;
        unpublishBase?: boolean | null;
        where?: AssetManyWhereInput | null;
      }
    >,
    selectorFn: (s: AssetConnection) => [...Sel],
  ): $Field<
    "unpublishManyAssetsConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        first: "Int",
        from: "[Stage!]!",
        last: "Int",
        locales: "[Locale!]",
        skip: "Int",
        stage: "Stage",
        unpublishBase: "Boolean",
        where: "AssetManyWhereInput",
      },
      args,

      selection: selectorFn(new AssetConnection()),
    };
    return this.$_select(
      "unpublishManyAssetsConnection",
      options as any,
    ) as any;
  }

  /**
   * Unpublish many Pitch documents
   */
  unpublishManyPitches<
    Args extends VariabledInput<{
      from?: Readonly<Array<Stage>>;
      where?: PitchManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        from?: Readonly<Array<Stage>>;
        where?: PitchManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"unpublishManyPitches", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        from: "[Stage!]!",
        where: "PitchManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("unpublishManyPitches", options as any) as any;
  }

  /**
   * Find many Pitch documents that match criteria in specified stage and unpublish from target stages
   */
  unpublishManyPitchesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      from?: Readonly<Array<Stage>>;
      last?: number | null;
      skip?: number | null;
      stage?: Stage | null;
      where?: PitchManyWhereInput | null;
    }>,
    Sel extends Selection<PitchConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        from?: Readonly<Array<Stage>>;
        last?: number | null;
        skip?: number | null;
        stage?: Stage | null;
        where?: PitchManyWhereInput | null;
      }
    >,
    selectorFn: (s: PitchConnection) => [...Sel],
  ): $Field<
    "unpublishManyPitchesConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        first: "Int",
        from: "[Stage!]!",
        last: "Int",
        skip: "Int",
        stage: "Stage",
        where: "PitchManyWhereInput",
      },
      args,

      selection: selectorFn(new PitchConnection()),
    };
    return this.$_select(
      "unpublishManyPitchesConnection",
      options as any,
    ) as any;
  }

  /**
   * Unpublish one pitch from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only.
   */
  unpublishPitch<
    Args extends VariabledInput<{
      from?: Readonly<Array<Stage>>;
      where: PitchWhereUniqueInput;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        from?: Readonly<Array<Stage>>;
        where: PitchWhereUniqueInput;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<"unpublishPitch", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        from: "[Stage!]!",
        where: "PitchWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("unpublishPitch", options as any) as any;
  }

  /**
   * Update one article
   */
  updateArticle<
    Args extends VariabledInput<{
      data: ArticleUpdateInput;
      where: ArticleWhereUniqueInput;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: ArticleUpdateInput;
        where: ArticleWhereUniqueInput;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<"updateArticle", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        data: "ArticleUpdateInput!",
        where: "ArticleWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("updateArticle", options as any) as any;
  }

  /**
   * Update one asset
   */
  updateAsset<
    Args extends VariabledInput<{
      data: AssetUpdateInput;
      where: AssetWhereUniqueInput;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: AssetUpdateInput;
        where: AssetWhereUniqueInput;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<"updateAsset", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        data: "AssetUpdateInput!",
        where: "AssetWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("updateAsset", options as any) as any;
  }

  /**
   * Update many articles
   */
  updateManyArticles<
    Args extends VariabledInput<{
      data: ArticleUpdateManyInput;
      where?: ArticleManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: ArticleUpdateManyInput;
        where?: ArticleManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"updateManyArticles", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        data: "ArticleUpdateManyInput!",
        where: "ArticleManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("updateManyArticles", options as any) as any;
  }

  /**
   * Update many Article documents
   */
  updateManyArticlesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      data: ArticleUpdateManyInput;
      first?: number | null;
      last?: number | null;
      skip?: number | null;
      where?: ArticleManyWhereInput | null;
    }>,
    Sel extends Selection<ArticleConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        data: ArticleUpdateManyInput;
        first?: number | null;
        last?: number | null;
        skip?: number | null;
        where?: ArticleManyWhereInput | null;
      }
    >,
    selectorFn: (s: ArticleConnection) => [...Sel],
  ): $Field<
    "updateManyArticlesConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        data: "ArticleUpdateManyInput!",
        first: "Int",
        last: "Int",
        skip: "Int",
        where: "ArticleManyWhereInput",
      },
      args,

      selection: selectorFn(new ArticleConnection()),
    };
    return this.$_select("updateManyArticlesConnection", options as any) as any;
  }

  /**
   * Update many assets
   */
  updateManyAssets<
    Args extends VariabledInput<{
      data: AssetUpdateManyInput;
      where?: AssetManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: AssetUpdateManyInput;
        where?: AssetManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"updateManyAssets", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        data: "AssetUpdateManyInput!",
        where: "AssetManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("updateManyAssets", options as any) as any;
  }

  /**
   * Update many Asset documents
   */
  updateManyAssetsConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      data: AssetUpdateManyInput;
      first?: number | null;
      last?: number | null;
      skip?: number | null;
      where?: AssetManyWhereInput | null;
    }>,
    Sel extends Selection<AssetConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        data: AssetUpdateManyInput;
        first?: number | null;
        last?: number | null;
        skip?: number | null;
        where?: AssetManyWhereInput | null;
      }
    >,
    selectorFn: (s: AssetConnection) => [...Sel],
  ): $Field<
    "updateManyAssetsConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        data: "AssetUpdateManyInput!",
        first: "Int",
        last: "Int",
        skip: "Int",
        where: "AssetManyWhereInput",
      },
      args,

      selection: selectorFn(new AssetConnection()),
    };
    return this.$_select("updateManyAssetsConnection", options as any) as any;
  }

  /**
   * Update many pitches
   */
  updateManyPitches<
    Args extends VariabledInput<{
      data: PitchUpdateManyInput;
      where?: PitchManyWhereInput | null;
    }>,
    Sel extends Selection<BatchPayload>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: PitchUpdateManyInput;
        where?: PitchManyWhereInput | null;
      }
    >,
    selectorFn: (s: BatchPayload) => [...Sel],
  ): $Field<"updateManyPitches", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        data: "PitchUpdateManyInput!",
        where: "PitchManyWhereInput",
      },
      args,

      selection: selectorFn(new BatchPayload()),
    };
    return this.$_select("updateManyPitches", options as any) as any;
  }

  /**
   * Update many Pitch documents
   */
  updateManyPitchesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      data: PitchUpdateManyInput;
      first?: number | null;
      last?: number | null;
      skip?: number | null;
      where?: PitchManyWhereInput | null;
    }>,
    Sel extends Selection<PitchConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        data: PitchUpdateManyInput;
        first?: number | null;
        last?: number | null;
        skip?: number | null;
        where?: PitchManyWhereInput | null;
      }
    >,
    selectorFn: (s: PitchConnection) => [...Sel],
  ): $Field<
    "updateManyPitchesConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "ID",
        before: "ID",
        data: "PitchUpdateManyInput!",
        first: "Int",
        last: "Int",
        skip: "Int",
        where: "PitchManyWhereInput",
      },
      args,

      selection: selectorFn(new PitchConnection()),
    };
    return this.$_select("updateManyPitchesConnection", options as any) as any;
  }

  /**
   * Update one pitch
   */
  updatePitch<
    Args extends VariabledInput<{
      data: PitchUpdateInput;
      where: PitchWhereUniqueInput;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: PitchUpdateInput;
        where: PitchWhereUniqueInput;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<"updatePitch", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        data: "PitchUpdateInput!",
        where: "PitchWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("updatePitch", options as any) as any;
  }

  /**
   * Update one scheduledRelease
   */
  updateScheduledRelease<
    Args extends VariabledInput<{
      data: ScheduledReleaseUpdateInput;
      where: ScheduledReleaseWhereUniqueInput;
    }>,
    Sel extends Selection<ScheduledRelease>,
  >(
    args: ExactArgNames<
      Args,
      {
        data: ScheduledReleaseUpdateInput;
        where: ScheduledReleaseWhereUniqueInput;
      }
    >,
    selectorFn: (s: ScheduledRelease) => [...Sel],
  ): $Field<
    "updateScheduledRelease",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        data: "ScheduledReleaseUpdateInput!",
        where: "ScheduledReleaseWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new ScheduledRelease()),
    };
    return this.$_select("updateScheduledRelease", options as any) as any;
  }

  /**
   * Upsert one article
   */
  upsertArticle<
    Args extends VariabledInput<{
      upsert: ArticleUpsertInput;
      where: ArticleWhereUniqueInput;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        upsert: ArticleUpsertInput;
        where: ArticleWhereUniqueInput;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<"upsertArticle", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        upsert: "ArticleUpsertInput!",
        where: "ArticleWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("upsertArticle", options as any) as any;
  }

  /**
   * Upsert one asset
   */
  upsertAsset<
    Args extends VariabledInput<{
      upsert: AssetUpsertInput;
      where: AssetWhereUniqueInput;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        upsert: AssetUpsertInput;
        where: AssetWhereUniqueInput;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<"upsertAsset", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        upsert: "AssetUpsertInput!",
        where: "AssetWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("upsertAsset", options as any) as any;
  }

  /**
   * Upsert one pitch
   */
  upsertPitch<
    Args extends VariabledInput<{
      upsert: PitchUpsertInput;
      where: PitchWhereUniqueInput;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        upsert: PitchUpsertInput;
        where: PitchWhereUniqueInput;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<"upsertPitch", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        upsert: "PitchUpsertInput!",
        where: "PitchWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("upsertPitch", options as any) as any;
  }
}

/**
 * An object with an ID
 */
export class Node extends $Interface<
  {
    Article: Article;
    Asset: Asset;
    Pitch: Pitch;
    ScheduledOperation: ScheduledOperation;
    ScheduledRelease: ScheduledRelease;
    User: User;
  },
  "Node"
> {
  constructor() {
    super(
      {
        Article: Article,
        Asset: Asset,
        Pitch: Pitch,
        ScheduledOperation: ScheduledOperation,
        ScheduledRelease: ScheduledRelease,
        User: User,
      },
      "Node",
    );
  }

  /**
   * The id of the object.
   */
  get id(): $Field<"id", string> {
    return this.$_select("id") as any;
  }

  /**
   * The Stage of an object
   */
  get stage(): $Field<"stage", Stage> {
    return this.$_select("stage") as any;
  }
}

/**
 * Information about pagination in a connection.
 */
export class PageInfo extends $Base<"PageInfo"> {
  constructor() {
    super("PageInfo");
  }

  /**
   * When paginating forwards, the cursor to continue.
   */
  get endCursor(): $Field<"endCursor", string | null> {
    return this.$_select("endCursor") as any;
  }

  /**
   * When paginating forwards, are there more items?
   */
  get hasNextPage(): $Field<"hasNextPage", boolean> {
    return this.$_select("hasNextPage") as any;
  }

  /**
   * When paginating backwards, are there more items?
   */
  get hasPreviousPage(): $Field<"hasPreviousPage", boolean> {
    return this.$_select("hasPreviousPage") as any;
  }

  /**
   * Number of items in the current page.
   */
  get pageSize(): $Field<"pageSize", number | null> {
    return this.$_select("pageSize") as any;
  }

  /**
   * When paginating backwards, the cursor to continue.
   */
  get startCursor(): $Field<"startCursor", string | null> {
    return this.$_select("startCursor") as any;
  }
}

export class Pitch extends $Base<"Pitch"> {
  constructor() {
    super("Pitch");
  }

  content<Sel extends Selection<RichText>>(
    selectorFn: (s: RichText) => [...Sel],
  ): $Field<"content", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new RichText()),
    };
    return this.$_select("content", options as any) as any;
  }

  /**
   * The time the document was created
   */
  get createdAt(): $Field<"createdAt", DateTime> {
    return this.$_select("createdAt") as any;
  }

  /**
   * User that created this document
   */
  createdBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"createdBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  createdBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"createdBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  createdBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("createdBy", options as any) as any;
  }

  /**
   * Get the document in other stages
   */
  documentInStages<
    Args extends VariabledInput<{
      includeCurrent?: boolean;
      inheritLocale?: boolean;
      stages?: Readonly<Array<Stage>>;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        includeCurrent?: boolean;
        inheritLocale?: boolean;
        stages?: Readonly<Array<Stage>>;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<
    "documentInStages",
    Array<GetOutput<Sel>>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        includeCurrent: "Boolean!",
        inheritLocale: "Boolean!",
        stages: "[Stage!]!",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("documentInStages", options as any) as any;
  }

  /**
   * List of Pitch versions
   */
  history<
    Args extends VariabledInput<{
      limit?: number;
      skip?: number;
      stageOverride?: Stage | null;
    }>,
    Sel extends Selection<Version>,
  >(
    args: ExactArgNames<
      Args,
      {
        limit?: number;
        skip?: number;
        stageOverride?: Stage | null;
      }
    >,
    selectorFn: (s: Version) => [...Sel],
  ): $Field<"history", Array<GetOutput<Sel>>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        limit: "Int!",
        skip: "Int!",
        stageOverride: "Stage",
      },
      args,

      selection: selectorFn(new Version()),
    };
    return this.$_select("history", options as any) as any;
  }

  /**
   * The unique identifier
   */
  get id(): $Field<"id", string> {
    return this.$_select("id") as any;
  }

  /**
   * The time the document was published. Null on documents in draft stage.
   */
  get publishedAt(): $Field<"publishedAt", DateTime | null> {
    return this.$_select("publishedAt") as any;
  }

  /**
   * User that last published this document
   */
  publishedBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"publishedBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  publishedBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"publishedBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  publishedBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("publishedBy", options as any) as any;
  }

  scheduledIn<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      forceParentLocale?: boolean | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>> | null;
      skip?: number | null;
      where?: ScheduledOperationWhereInput | null;
    }>,
    Sel extends Selection<ScheduledOperation>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        forceParentLocale?: boolean | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>> | null;
        skip?: number | null;
        where?: ScheduledOperationWhereInput | null;
      }
    >,
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<"scheduledIn", Array<GetOutput<Sel>>, GetVariables<Sel, Args>>;
  scheduledIn<Sel extends Selection<ScheduledOperation>>(
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<"scheduledIn", Array<GetOutput<Sel>>, GetVariables<Sel>>;
  scheduledIn(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        forceParentLocale: "Boolean",
        last: "Int",
        locales: "[Locale!]",
        skip: "Int",
        where: "ScheduledOperationWhereInput",
      },
      args,

      selection: selectorFn(new ScheduledOperation()),
    };
    return this.$_select("scheduledIn", options as any) as any;
  }

  /**
   * System stage field
   */
  get stage(): $Field<"stage", Stage> {
    return this.$_select("stage") as any;
  }

  get title(): $Field<"title", string> {
    return this.$_select("title") as any;
  }

  /**
   * The time the document was updated
   */
  get updatedAt(): $Field<"updatedAt", DateTime> {
    return this.$_select("updatedAt") as any;
  }

  /**
   * User that last updated this document
   */
  updatedBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"updatedBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  updatedBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"updatedBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  updatedBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("updatedBy", options as any) as any;
  }
}

export type PitchConnectInput = {
  position?: ConnectPositionInput | null;
  where: PitchWhereUniqueInput;
};

/**
 * A connection to a list of items.
 */
export class PitchConnection extends $Base<"PitchConnection"> {
  constructor() {
    super("PitchConnection");
  }

  aggregate<Sel extends Selection<Aggregate>>(
    selectorFn: (s: Aggregate) => [...Sel],
  ): $Field<"aggregate", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new Aggregate()),
    };
    return this.$_select("aggregate", options as any) as any;
  }

  /**
   * A list of edges.
   */
  edges<Sel extends Selection<PitchEdge>>(
    selectorFn: (s: PitchEdge) => [...Sel],
  ): $Field<"edges", Array<GetOutput<Sel>>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new PitchEdge()),
    };
    return this.$_select("edges", options as any) as any;
  }

  /**
   * Information to aid in pagination.
   */
  pageInfo<Sel extends Selection<PageInfo>>(
    selectorFn: (s: PageInfo) => [...Sel],
  ): $Field<"pageInfo", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new PageInfo()),
    };
    return this.$_select("pageInfo", options as any) as any;
  }
}

export type PitchCreateInput = {
  content: RichTextAST;
  createdAt?: DateTime | null;
  title: string;
  updatedAt?: DateTime | null;
};

export type PitchCreateManyInlineInput = {
  connect?: Readonly<Array<PitchWhereUniqueInput>> | null;
  create?: Readonly<Array<PitchCreateInput>> | null;
};

export type PitchCreateOneInlineInput = {
  connect?: PitchWhereUniqueInput | null;
  create?: PitchCreateInput | null;
};

/**
 * An edge in a connection.
 */
export class PitchEdge extends $Base<"PitchEdge"> {
  constructor() {
    super("PitchEdge");
  }

  /**
   * A cursor for use in pagination.
   */
  get cursor(): $Field<"cursor", string> {
    return this.$_select("cursor") as any;
  }

  /**
   * The item at the end of the edge.
   */
  node<Sel extends Selection<Pitch>>(
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<"node", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new Pitch()),
    };
    return this.$_select("node", options as any) as any;
  }
}

/**
 * Identifies documents
 */
export type PitchManyWhereInput = {
  AND?: Readonly<Array<PitchWhereInput>> | null;
  NOT?: Readonly<Array<PitchWhereInput>> | null;
  OR?: Readonly<Array<PitchWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  createdBy?: UserWhereInput | null;
  documentInStages_every?: PitchWhereStageInput | null;
  documentInStages_none?: PitchWhereStageInput | null;
  documentInStages_some?: PitchWhereStageInput | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  publishedBy?: UserWhereInput | null;
  scheduledIn_every?: ScheduledOperationWhereInput | null;
  scheduledIn_none?: ScheduledOperationWhereInput | null;
  scheduledIn_some?: ScheduledOperationWhereInput | null;
  title?: string | null;
  title_contains?: string | null;
  title_ends_with?: string | null;
  title_in?: Readonly<Array<string | null>> | null;
  title_not?: string | null;
  title_not_contains?: string | null;
  title_not_ends_with?: string | null;
  title_not_in?: Readonly<Array<string | null>> | null;
  title_not_starts_with?: string | null;
  title_starts_with?: string | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedBy?: UserWhereInput | null;
};

export enum PitchOrderByInput {
  createdAt_ASC = "createdAt_ASC",

  createdAt_DESC = "createdAt_DESC",

  id_ASC = "id_ASC",

  id_DESC = "id_DESC",

  publishedAt_ASC = "publishedAt_ASC",

  publishedAt_DESC = "publishedAt_DESC",

  title_ASC = "title_ASC",

  title_DESC = "title_DESC",

  updatedAt_ASC = "updatedAt_ASC",

  updatedAt_DESC = "updatedAt_DESC",
}

export type PitchUpdateInput = {
  content?: RichTextAST | null;
  title?: string | null;
};

export type PitchUpdateManyInlineInput = {
  connect?: Readonly<Array<PitchConnectInput>> | null;
  create?: Readonly<Array<PitchCreateInput>> | null;
  delete?: Readonly<Array<PitchWhereUniqueInput>> | null;
  disconnect?: Readonly<Array<PitchWhereUniqueInput>> | null;
  set?: Readonly<Array<PitchWhereUniqueInput>> | null;
  update?: Readonly<Array<PitchUpdateWithNestedWhereUniqueInput>> | null;
  upsert?: Readonly<Array<PitchUpsertWithNestedWhereUniqueInput>> | null;
};

export type PitchUpdateManyInput = {
  content?: RichTextAST | null;
  title?: string | null;
};

export type PitchUpdateManyWithNestedWhereInput = {
  data: PitchUpdateManyInput;
  where: PitchWhereInput;
};

export type PitchUpdateOneInlineInput = {
  connect?: PitchWhereUniqueInput | null;
  create?: PitchCreateInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: PitchUpdateWithNestedWhereUniqueInput | null;
  upsert?: PitchUpsertWithNestedWhereUniqueInput | null;
};

export type PitchUpdateWithNestedWhereUniqueInput = {
  data: PitchUpdateInput;
  where: PitchWhereUniqueInput;
};

export type PitchUpsertInput = {
  create: PitchCreateInput;
  update: PitchUpdateInput;
};

export type PitchUpsertWithNestedWhereUniqueInput = {
  data: PitchUpsertInput;
  where: PitchWhereUniqueInput;
};

/**
 * This contains a set of filters that can be used to compare values internally
 */
export type PitchWhereComparatorInput = {
  outdated_to?: boolean | null;
};

/**
 * Identifies documents
 */
export type PitchWhereInput = {
  AND?: Readonly<Array<PitchWhereInput>> | null;
  NOT?: Readonly<Array<PitchWhereInput>> | null;
  OR?: Readonly<Array<PitchWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  createdBy?: UserWhereInput | null;
  documentInStages_every?: PitchWhereStageInput | null;
  documentInStages_none?: PitchWhereStageInput | null;
  documentInStages_some?: PitchWhereStageInput | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  publishedBy?: UserWhereInput | null;
  scheduledIn_every?: ScheduledOperationWhereInput | null;
  scheduledIn_none?: ScheduledOperationWhereInput | null;
  scheduledIn_some?: ScheduledOperationWhereInput | null;
  title?: string | null;
  title_contains?: string | null;
  title_ends_with?: string | null;
  title_in?: Readonly<Array<string | null>> | null;
  title_not?: string | null;
  title_not_contains?: string | null;
  title_not_ends_with?: string | null;
  title_not_in?: Readonly<Array<string | null>> | null;
  title_not_starts_with?: string | null;
  title_starts_with?: string | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedBy?: UserWhereInput | null;
};

/**
 * The document in stages filter allows specifying a stage entry to cross compare the same document between different stages
 */
export type PitchWhereStageInput = {
  AND?: Readonly<Array<PitchWhereStageInput>> | null;
  NOT?: Readonly<Array<PitchWhereStageInput>> | null;
  OR?: Readonly<Array<PitchWhereStageInput>> | null;
  compareWithParent?: PitchWhereComparatorInput | null;
  stage?: Stage | null;
};

/**
 * References Pitch record uniquely
 */
export type PitchWhereUniqueInput = {
  id?: string | null;
};

export type PublishLocaleInput = {
  locale: Locale;
  stages: Readonly<Array<Stage>>;
};

export class Query extends $Base<"Query"> {
  constructor() {
    super("Query");
  }

  /**
   * Retrieve a single article
   */
  article<
    Args extends VariabledInput<{
      locales?: Readonly<Array<Locale>>;
      stage?: Stage;
      where: ArticleWhereUniqueInput;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        locales?: Readonly<Array<Locale>>;
        stage?: Stage;
        where: ArticleWhereUniqueInput;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<"article", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        locales: "[Locale!]!",
        stage: "Stage!",
        where: "ArticleWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("article", options as any) as any;
  }

  /**
   * Retrieve document version
   */
  articleVersion<
    Args extends VariabledInput<{
      where: VersionWhereInput;
    }>,
    Sel extends Selection<DocumentVersion>,
  >(
    args: ExactArgNames<
      Args,
      {
        where: VersionWhereInput;
      }
    >,
    selectorFn: (s: DocumentVersion) => [...Sel],
  ): $Field<"articleVersion", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        where: "VersionWhereInput!",
      },
      args,

      selection: selectorFn(new DocumentVersion()),
    };
    return this.$_select("articleVersion", options as any) as any;
  }

  /**
   * Retrieve multiple articles
   */
  articles<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: ArticleOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: ArticleWhereInput | null;
    }>,
    Sel extends Selection<Article>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: ArticleOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: ArticleWhereInput | null;
      }
    >,
    selectorFn: (s: Article) => [...Sel],
  ): $Field<"articles", Array<GetOutput<Sel>>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "ArticleOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "ArticleWhereInput",
      },
      args,

      selection: selectorFn(new Article()),
    };
    return this.$_select("articles", options as any) as any;
  }

  /**
   * Retrieve multiple articles using the Relay connection interface
   */
  articlesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: ArticleOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: ArticleWhereInput | null;
    }>,
    Sel extends Selection<ArticleConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: ArticleOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: ArticleWhereInput | null;
      }
    >,
    selectorFn: (s: ArticleConnection) => [...Sel],
  ): $Field<"articlesConnection", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "ArticleOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "ArticleWhereInput",
      },
      args,

      selection: selectorFn(new ArticleConnection()),
    };
    return this.$_select("articlesConnection", options as any) as any;
  }

  /**
   * Retrieve a single asset
   */
  asset<
    Args extends VariabledInput<{
      locales?: Readonly<Array<Locale>>;
      stage?: Stage;
      where: AssetWhereUniqueInput;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        locales?: Readonly<Array<Locale>>;
        stage?: Stage;
        where: AssetWhereUniqueInput;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<"asset", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        locales: "[Locale!]!",
        stage: "Stage!",
        where: "AssetWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("asset", options as any) as any;
  }

  /**
   * Retrieve document version
   */
  assetVersion<
    Args extends VariabledInput<{
      where: VersionWhereInput;
    }>,
    Sel extends Selection<DocumentVersion>,
  >(
    args: ExactArgNames<
      Args,
      {
        where: VersionWhereInput;
      }
    >,
    selectorFn: (s: DocumentVersion) => [...Sel],
  ): $Field<"assetVersion", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        where: "VersionWhereInput!",
      },
      args,

      selection: selectorFn(new DocumentVersion()),
    };
    return this.$_select("assetVersion", options as any) as any;
  }

  /**
   * Retrieve multiple assets
   */
  assets<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: AssetOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: AssetWhereInput | null;
    }>,
    Sel extends Selection<Asset>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: AssetOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: AssetWhereInput | null;
      }
    >,
    selectorFn: (s: Asset) => [...Sel],
  ): $Field<"assets", Array<GetOutput<Sel>>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "AssetOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "AssetWhereInput",
      },
      args,

      selection: selectorFn(new Asset()),
    };
    return this.$_select("assets", options as any) as any;
  }

  /**
   * Retrieve multiple assets using the Relay connection interface
   */
  assetsConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: AssetOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: AssetWhereInput | null;
    }>,
    Sel extends Selection<AssetConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: AssetOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: AssetWhereInput | null;
      }
    >,
    selectorFn: (s: AssetConnection) => [...Sel],
  ): $Field<"assetsConnection", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "AssetOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "AssetWhereInput",
      },
      args,

      selection: selectorFn(new AssetConnection()),
    };
    return this.$_select("assetsConnection", options as any) as any;
  }

  /**
   * Fetches an object given its ID
   */
  entities<
    Args extends VariabledInput<{
      locales?: Readonly<Array<Locale>> | null;
      where: Readonly<Array<EntityWhereInput>>;
    }>,
    Sel extends Selection<Entity>,
  >(
    args: ExactArgNames<
      Args,
      {
        locales?: Readonly<Array<Locale>> | null;
        where: Readonly<Array<EntityWhereInput>>;
      }
    >,
    selectorFn: (s: Entity) => [...Sel],
  ): $Field<"entities", Array<GetOutput<Sel>> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        locales: "[Locale!]",
        where: "[EntityWhereInput!]!",
      },
      args,

      selection: selectorFn(new Entity()),
    };
    return this.$_select("entities", options as any) as any;
  }

  /**
   * Fetches an object given its ID
   */
  node<
    Args extends VariabledInput<{
      id: string;
      locales?: Readonly<Array<Locale>>;
      stage?: Stage;
    }>,
    Sel extends Selection<Node>,
  >(
    args: ExactArgNames<
      Args,
      {
        id: string;
        locales?: Readonly<Array<Locale>>;
        stage?: Stage;
      }
    >,
    selectorFn: (s: Node) => [...Sel],
  ): $Field<"node", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        id: "ID!",
        locales: "[Locale!]!",
        stage: "Stage!",
      },
      args,

      selection: selectorFn(new Node()),
    };
    return this.$_select("node", options as any) as any;
  }

  /**
   * Retrieve a single pitch
   */
  pitch<
    Args extends VariabledInput<{
      locales?: Readonly<Array<Locale>>;
      stage?: Stage;
      where: PitchWhereUniqueInput;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        locales?: Readonly<Array<Locale>>;
        stage?: Stage;
        where: PitchWhereUniqueInput;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<"pitch", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        locales: "[Locale!]!",
        stage: "Stage!",
        where: "PitchWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("pitch", options as any) as any;
  }

  /**
   * Retrieve document version
   */
  pitchVersion<
    Args extends VariabledInput<{
      where: VersionWhereInput;
    }>,
    Sel extends Selection<DocumentVersion>,
  >(
    args: ExactArgNames<
      Args,
      {
        where: VersionWhereInput;
      }
    >,
    selectorFn: (s: DocumentVersion) => [...Sel],
  ): $Field<"pitchVersion", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        where: "VersionWhereInput!",
      },
      args,

      selection: selectorFn(new DocumentVersion()),
    };
    return this.$_select("pitchVersion", options as any) as any;
  }

  /**
   * Retrieve multiple pitches
   */
  pitches<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: PitchOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: PitchWhereInput | null;
    }>,
    Sel extends Selection<Pitch>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: PitchOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: PitchWhereInput | null;
      }
    >,
    selectorFn: (s: Pitch) => [...Sel],
  ): $Field<"pitches", Array<GetOutput<Sel>>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "PitchOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "PitchWhereInput",
      },
      args,

      selection: selectorFn(new Pitch()),
    };
    return this.$_select("pitches", options as any) as any;
  }

  /**
   * Retrieve multiple pitches using the Relay connection interface
   */
  pitchesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: PitchOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: PitchWhereInput | null;
    }>,
    Sel extends Selection<PitchConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: PitchOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: PitchWhereInput | null;
      }
    >,
    selectorFn: (s: PitchConnection) => [...Sel],
  ): $Field<"pitchesConnection", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "PitchOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "PitchWhereInput",
      },
      args,

      selection: selectorFn(new PitchConnection()),
    };
    return this.$_select("pitchesConnection", options as any) as any;
  }

  /**
   * Retrieve a single scheduledOperation
   */
  scheduledOperation<
    Args extends VariabledInput<{
      locales?: Readonly<Array<Locale>>;
      stage?: Stage;
      where: ScheduledOperationWhereUniqueInput;
    }>,
    Sel extends Selection<ScheduledOperation>,
  >(
    args: ExactArgNames<
      Args,
      {
        locales?: Readonly<Array<Locale>>;
        stage?: Stage;
        where: ScheduledOperationWhereUniqueInput;
      }
    >,
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<
    "scheduledOperation",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        locales: "[Locale!]!",
        stage: "Stage!",
        where: "ScheduledOperationWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new ScheduledOperation()),
    };
    return this.$_select("scheduledOperation", options as any) as any;
  }

  /**
   * Retrieve multiple scheduledOperations
   */
  scheduledOperations<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: ScheduledOperationOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: ScheduledOperationWhereInput | null;
    }>,
    Sel extends Selection<ScheduledOperation>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: ScheduledOperationOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: ScheduledOperationWhereInput | null;
      }
    >,
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<
    "scheduledOperations",
    Array<GetOutput<Sel>>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "ScheduledOperationOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "ScheduledOperationWhereInput",
      },
      args,

      selection: selectorFn(new ScheduledOperation()),
    };
    return this.$_select("scheduledOperations", options as any) as any;
  }

  /**
   * Retrieve multiple scheduledOperations using the Relay connection interface
   */
  scheduledOperationsConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: ScheduledOperationOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: ScheduledOperationWhereInput | null;
    }>,
    Sel extends Selection<ScheduledOperationConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: ScheduledOperationOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: ScheduledOperationWhereInput | null;
      }
    >,
    selectorFn: (s: ScheduledOperationConnection) => [...Sel],
  ): $Field<
    "scheduledOperationsConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "ScheduledOperationOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "ScheduledOperationWhereInput",
      },
      args,

      selection: selectorFn(new ScheduledOperationConnection()),
    };
    return this.$_select(
      "scheduledOperationsConnection",
      options as any,
    ) as any;
  }

  /**
   * Retrieve a single scheduledRelease
   */
  scheduledRelease<
    Args extends VariabledInput<{
      locales?: Readonly<Array<Locale>>;
      stage?: Stage;
      where: ScheduledReleaseWhereUniqueInput;
    }>,
    Sel extends Selection<ScheduledRelease>,
  >(
    args: ExactArgNames<
      Args,
      {
        locales?: Readonly<Array<Locale>>;
        stage?: Stage;
        where: ScheduledReleaseWhereUniqueInput;
      }
    >,
    selectorFn: (s: ScheduledRelease) => [...Sel],
  ): $Field<
    "scheduledRelease",
    GetOutput<Sel> | null,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        locales: "[Locale!]!",
        stage: "Stage!",
        where: "ScheduledReleaseWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new ScheduledRelease()),
    };
    return this.$_select("scheduledRelease", options as any) as any;
  }

  /**
   * Retrieve multiple scheduledReleases
   */
  scheduledReleases<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: ScheduledReleaseOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: ScheduledReleaseWhereInput | null;
    }>,
    Sel extends Selection<ScheduledRelease>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: ScheduledReleaseOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: ScheduledReleaseWhereInput | null;
      }
    >,
    selectorFn: (s: ScheduledRelease) => [...Sel],
  ): $Field<
    "scheduledReleases",
    Array<GetOutput<Sel>>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "ScheduledReleaseOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "ScheduledReleaseWhereInput",
      },
      args,

      selection: selectorFn(new ScheduledRelease()),
    };
    return this.$_select("scheduledReleases", options as any) as any;
  }

  /**
   * Retrieve multiple scheduledReleases using the Relay connection interface
   */
  scheduledReleasesConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: ScheduledReleaseOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: ScheduledReleaseWhereInput | null;
    }>,
    Sel extends Selection<ScheduledReleaseConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: ScheduledReleaseOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: ScheduledReleaseWhereInput | null;
      }
    >,
    selectorFn: (s: ScheduledReleaseConnection) => [...Sel],
  ): $Field<
    "scheduledReleasesConnection",
    GetOutput<Sel>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "ScheduledReleaseOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "ScheduledReleaseWhereInput",
      },
      args,

      selection: selectorFn(new ScheduledReleaseConnection()),
    };
    return this.$_select("scheduledReleasesConnection", options as any) as any;
  }

  /**
   * Retrieve a single user
   */
  user<
    Args extends VariabledInput<{
      locales?: Readonly<Array<Locale>>;
      stage?: Stage;
      where: UserWhereUniqueInput;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        locales?: Readonly<Array<Locale>>;
        stage?: Stage;
        where: UserWhereUniqueInput;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"user", GetOutput<Sel> | null, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        locales: "[Locale!]!",
        stage: "Stage!",
        where: "UserWhereUniqueInput!",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("user", options as any) as any;
  }

  /**
   * Retrieve multiple users
   */
  users<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: UserOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: UserWhereInput | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: UserOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: UserWhereInput | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"users", Array<GetOutput<Sel>>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "UserOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "UserWhereInput",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("users", options as any) as any;
  }

  /**
   * Retrieve multiple users using the Relay connection interface
   */
  usersConnection<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>>;
      orderBy?: UserOrderByInput | null;
      skip?: number | null;
      stage?: Stage;
      where?: UserWhereInput | null;
    }>,
    Sel extends Selection<UserConnection>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>>;
        orderBy?: UserOrderByInput | null;
        skip?: number | null;
        stage?: Stage;
        where?: UserWhereInput | null;
      }
    >,
    selectorFn: (s: UserConnection) => [...Sel],
  ): $Field<"usersConnection", GetOutput<Sel>, GetVariables<Sel, Args>> {
    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        last: "Int",
        locales: "[Locale!]!",
        orderBy: "UserOrderByInput",
        skip: "Int",
        stage: "Stage!",
        where: "UserWhereInput",
      },
      args,

      selection: selectorFn(new UserConnection()),
    };
    return this.$_select("usersConnection", options as any) as any;
  }
}

/**
 * Representing a RGBA color value: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba()
 */
export class RGBA extends $Base<"RGBA"> {
  constructor() {
    super("RGBA");
  }

  get a(): $Field<"a", RGBATransparency> {
    return this.$_select("a") as any;
  }

  get b(): $Field<"b", RGBAHue> {
    return this.$_select("b") as any;
  }

  get g(): $Field<"g", RGBAHue> {
    return this.$_select("g") as any;
  }

  get r(): $Field<"r", RGBAHue> {
    return this.$_select("r") as any;
  }
}

export type RGBAHue = string;

/**
 * Input type representing a RGBA color value: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba()
 */
export type RGBAInput = {
  a: RGBATransparency;
  b: RGBAHue;
  g: RGBAHue;
  r: RGBAHue;
};

export type RGBATransparency = string;

/**
 * Custom type representing a rich text value comprising of raw rich text ast, html, markdown and text values
 */
export class RichText extends $Base<"RichText"> {
  constructor() {
    super("RichText");
  }

  /**
   * Returns HTMl representation
   */
  get html(): $Field<"html", string> {
    return this.$_select("html") as any;
  }

  /**
   * Returns Markdown representation
   */
  get markdown(): $Field<"markdown", string> {
    return this.$_select("markdown") as any;
  }

  /**
   * Returns AST representation
   */
  get raw(): $Field<"raw", RichTextAST> {
    return this.$_select("raw") as any;
  }

  /**
   * Returns plain-text contents of RichText
   */
  get text(): $Field<"text", string> {
    return this.$_select("text") as any;
  }
}

/**
 * Slate-compatible RichText AST
 */
export type RichTextAST = string;

/**
 * Scheduled Operation system model
 */
export class ScheduledOperation extends $Base<"ScheduledOperation"> {
  constructor() {
    super("ScheduledOperation");
  }

  affectedDocuments<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      forceParentLocale?: boolean | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>> | null;
      skip?: number | null;
    }>,
    Sel extends Selection<ScheduledOperationAffectedDocument>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        forceParentLocale?: boolean | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>> | null;
        skip?: number | null;
      }
    >,
    selectorFn: (s: ScheduledOperationAffectedDocument) => [...Sel],
  ): $Field<
    "affectedDocuments",
    Array<GetOutput<Sel>>,
    GetVariables<Sel, Args>
  >;
  affectedDocuments<Sel extends Selection<ScheduledOperationAffectedDocument>>(
    selectorFn: (s: ScheduledOperationAffectedDocument) => [...Sel],
  ): $Field<"affectedDocuments", Array<GetOutput<Sel>>, GetVariables<Sel>>;
  affectedDocuments(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        forceParentLocale: "Boolean",
        last: "Int",
        locales: "[Locale!]",
        skip: "Int",
      },
      args,

      selection: selectorFn(new ScheduledOperationAffectedDocument()),
    };
    return this.$_select("affectedDocuments", options as any) as any;
  }

  /**
   * The time the document was created
   */
  get createdAt(): $Field<"createdAt", DateTime> {
    return this.$_select("createdAt") as any;
  }

  /**
   * User that created this document
   */
  createdBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"createdBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  createdBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"createdBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  createdBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("createdBy", options as any) as any;
  }

  /**
   * Operation description
   */
  get description(): $Field<"description", string | null> {
    return this.$_select("description") as any;
  }

  /**
   * Get the document in other stages
   */
  documentInStages<
    Args extends VariabledInput<{
      includeCurrent?: boolean;
      inheritLocale?: boolean;
      stages?: Readonly<Array<Stage>>;
    }>,
    Sel extends Selection<ScheduledOperation>,
  >(
    args: ExactArgNames<
      Args,
      {
        includeCurrent?: boolean;
        inheritLocale?: boolean;
        stages?: Readonly<Array<Stage>>;
      }
    >,
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<
    "documentInStages",
    Array<GetOutput<Sel>>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        includeCurrent: "Boolean!",
        inheritLocale: "Boolean!",
        stages: "[Stage!]!",
      },
      args,

      selection: selectorFn(new ScheduledOperation()),
    };
    return this.$_select("documentInStages", options as any) as any;
  }

  /**
   * Operation error message
   */
  get errorMessage(): $Field<"errorMessage", string | null> {
    return this.$_select("errorMessage") as any;
  }

  /**
   * The unique identifier
   */
  get id(): $Field<"id", string> {
    return this.$_select("id") as any;
  }

  /**
   * The time the document was published. Null on documents in draft stage.
   */
  get publishedAt(): $Field<"publishedAt", DateTime | null> {
    return this.$_select("publishedAt") as any;
  }

  /**
   * User that last published this document
   */
  publishedBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"publishedBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  publishedBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"publishedBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  publishedBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("publishedBy", options as any) as any;
  }

  /**
   * Raw operation payload including all details, this field is subject to change
   */
  get rawPayload(): $Field<"rawPayload", Json> {
    return this.$_select("rawPayload") as any;
  }

  /**
   * The release this operation is scheduled for
   */
  release<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<ScheduledRelease>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: ScheduledRelease) => [...Sel],
  ): $Field<"release", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  release<Sel extends Selection<ScheduledRelease>>(
    selectorFn: (s: ScheduledRelease) => [...Sel],
  ): $Field<"release", GetOutput<Sel> | null, GetVariables<Sel>>;
  release(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new ScheduledRelease()),
    };
    return this.$_select("release", options as any) as any;
  }

  /**
   * System stage field
   */
  get stage(): $Field<"stage", Stage> {
    return this.$_select("stage") as any;
  }

  /**
   * operation Status
   */
  get status(): $Field<"status", ScheduledOperationStatus> {
    return this.$_select("status") as any;
  }

  /**
   * The time the document was updated
   */
  get updatedAt(): $Field<"updatedAt", DateTime> {
    return this.$_select("updatedAt") as any;
  }

  /**
   * User that last updated this document
   */
  updatedBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"updatedBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  updatedBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"updatedBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  updatedBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("updatedBy", options as any) as any;
  }
}

export class ScheduledOperationAffectedDocument extends $Union<
  { Article: Article; Asset: Asset; Pitch: Pitch; Entity: Entity; Node: Node },
  "ScheduledOperationAffectedDocument"
> {
  constructor() {
    super(
      {
        Article: Article,
        Asset: Asset,
        Pitch: Pitch,
        Entity: Entity,
        Node: Node,
      },
      "ScheduledOperationAffectedDocument",
    );
  }
}

export type ScheduledOperationConnectInput = {
  position?: ConnectPositionInput | null;
  where: ScheduledOperationWhereUniqueInput;
};

/**
 * A connection to a list of items.
 */
export class ScheduledOperationConnection extends $Base<"ScheduledOperationConnection"> {
  constructor() {
    super("ScheduledOperationConnection");
  }

  aggregate<Sel extends Selection<Aggregate>>(
    selectorFn: (s: Aggregate) => [...Sel],
  ): $Field<"aggregate", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new Aggregate()),
    };
    return this.$_select("aggregate", options as any) as any;
  }

  /**
   * A list of edges.
   */
  edges<Sel extends Selection<ScheduledOperationEdge>>(
    selectorFn: (s: ScheduledOperationEdge) => [...Sel],
  ): $Field<"edges", Array<GetOutput<Sel>>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new ScheduledOperationEdge()),
    };
    return this.$_select("edges", options as any) as any;
  }

  /**
   * Information to aid in pagination.
   */
  pageInfo<Sel extends Selection<PageInfo>>(
    selectorFn: (s: PageInfo) => [...Sel],
  ): $Field<"pageInfo", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new PageInfo()),
    };
    return this.$_select("pageInfo", options as any) as any;
  }
}

export type ScheduledOperationCreateManyInlineInput = {
  connect?: Readonly<Array<ScheduledOperationWhereUniqueInput>> | null;
};

export type ScheduledOperationCreateOneInlineInput = {
  connect?: ScheduledOperationWhereUniqueInput | null;
};

/**
 * An edge in a connection.
 */
export class ScheduledOperationEdge extends $Base<"ScheduledOperationEdge"> {
  constructor() {
    super("ScheduledOperationEdge");
  }

  /**
   * A cursor for use in pagination.
   */
  get cursor(): $Field<"cursor", string> {
    return this.$_select("cursor") as any;
  }

  /**
   * The item at the end of the edge.
   */
  node<Sel extends Selection<ScheduledOperation>>(
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<"node", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new ScheduledOperation()),
    };
    return this.$_select("node", options as any) as any;
  }
}

/**
 * Identifies documents
 */
export type ScheduledOperationManyWhereInput = {
  AND?: Readonly<Array<ScheduledOperationWhereInput>> | null;
  NOT?: Readonly<Array<ScheduledOperationWhereInput>> | null;
  OR?: Readonly<Array<ScheduledOperationWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  createdBy?: UserWhereInput | null;
  description?: string | null;
  description_contains?: string | null;
  description_ends_with?: string | null;
  description_in?: Readonly<Array<string | null>> | null;
  description_not?: string | null;
  description_not_contains?: string | null;
  description_not_ends_with?: string | null;
  description_not_in?: Readonly<Array<string | null>> | null;
  description_not_starts_with?: string | null;
  description_starts_with?: string | null;
  errorMessage?: string | null;
  errorMessage_contains?: string | null;
  errorMessage_ends_with?: string | null;
  errorMessage_in?: Readonly<Array<string | null>> | null;
  errorMessage_not?: string | null;
  errorMessage_not_contains?: string | null;
  errorMessage_not_ends_with?: string | null;
  errorMessage_not_in?: Readonly<Array<string | null>> | null;
  errorMessage_not_starts_with?: string | null;
  errorMessage_starts_with?: string | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  publishedBy?: UserWhereInput | null;
  rawPayload_json_path_exists?: string | null;
  rawPayload_value_recursive?: Json | null;
  release?: ScheduledReleaseWhereInput | null;
  status?: ScheduledOperationStatus | null;
  status_in?: Readonly<Array<ScheduledOperationStatus | null>> | null;
  status_not?: ScheduledOperationStatus | null;
  status_not_in?: Readonly<Array<ScheduledOperationStatus | null>> | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedBy?: UserWhereInput | null;
};

export enum ScheduledOperationOrderByInput {
  createdAt_ASC = "createdAt_ASC",

  createdAt_DESC = "createdAt_DESC",

  description_ASC = "description_ASC",

  description_DESC = "description_DESC",

  errorMessage_ASC = "errorMessage_ASC",

  errorMessage_DESC = "errorMessage_DESC",

  id_ASC = "id_ASC",

  id_DESC = "id_DESC",

  publishedAt_ASC = "publishedAt_ASC",

  publishedAt_DESC = "publishedAt_DESC",

  status_ASC = "status_ASC",

  status_DESC = "status_DESC",

  updatedAt_ASC = "updatedAt_ASC",

  updatedAt_DESC = "updatedAt_DESC",
}

/**
 * System Scheduled Operation Status
 */
export enum ScheduledOperationStatus {
  CANCELED = "CANCELED",

  COMPLETED = "COMPLETED",

  FAILED = "FAILED",

  IN_PROGRESS = "IN_PROGRESS",

  PENDING = "PENDING",
}

export type ScheduledOperationUpdateManyInlineInput = {
  connect?: Readonly<Array<ScheduledOperationConnectInput>> | null;
  disconnect?: Readonly<Array<ScheduledOperationWhereUniqueInput>> | null;
  set?: Readonly<Array<ScheduledOperationWhereUniqueInput>> | null;
};

export type ScheduledOperationUpdateOneInlineInput = {
  connect?: ScheduledOperationWhereUniqueInput | null;
  disconnect?: boolean | null;
};

/**
 * Identifies documents
 */
export type ScheduledOperationWhereInput = {
  AND?: Readonly<Array<ScheduledOperationWhereInput>> | null;
  NOT?: Readonly<Array<ScheduledOperationWhereInput>> | null;
  OR?: Readonly<Array<ScheduledOperationWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  createdBy?: UserWhereInput | null;
  description?: string | null;
  description_contains?: string | null;
  description_ends_with?: string | null;
  description_in?: Readonly<Array<string | null>> | null;
  description_not?: string | null;
  description_not_contains?: string | null;
  description_not_ends_with?: string | null;
  description_not_in?: Readonly<Array<string | null>> | null;
  description_not_starts_with?: string | null;
  description_starts_with?: string | null;
  errorMessage?: string | null;
  errorMessage_contains?: string | null;
  errorMessage_ends_with?: string | null;
  errorMessage_in?: Readonly<Array<string | null>> | null;
  errorMessage_not?: string | null;
  errorMessage_not_contains?: string | null;
  errorMessage_not_ends_with?: string | null;
  errorMessage_not_in?: Readonly<Array<string | null>> | null;
  errorMessage_not_starts_with?: string | null;
  errorMessage_starts_with?: string | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  publishedBy?: UserWhereInput | null;
  rawPayload_json_path_exists?: string | null;
  rawPayload_value_recursive?: Json | null;
  release?: ScheduledReleaseWhereInput | null;
  status?: ScheduledOperationStatus | null;
  status_in?: Readonly<Array<ScheduledOperationStatus | null>> | null;
  status_not?: ScheduledOperationStatus | null;
  status_not_in?: Readonly<Array<ScheduledOperationStatus | null>> | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedBy?: UserWhereInput | null;
};

/**
 * References ScheduledOperation record uniquely
 */
export type ScheduledOperationWhereUniqueInput = {
  id?: string | null;
};

/**
 * Scheduled Release system model
 */
export class ScheduledRelease extends $Base<"ScheduledRelease"> {
  constructor() {
    super("ScheduledRelease");
  }

  /**
   * The time the document was created
   */
  get createdAt(): $Field<"createdAt", DateTime> {
    return this.$_select("createdAt") as any;
  }

  /**
   * User that created this document
   */
  createdBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"createdBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  createdBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"createdBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  createdBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("createdBy", options as any) as any;
  }

  /**
   * Release description
   */
  get description(): $Field<"description", string | null> {
    return this.$_select("description") as any;
  }

  /**
   * Get the document in other stages
   */
  documentInStages<
    Args extends VariabledInput<{
      includeCurrent?: boolean;
      inheritLocale?: boolean;
      stages?: Readonly<Array<Stage>>;
    }>,
    Sel extends Selection<ScheduledRelease>,
  >(
    args: ExactArgNames<
      Args,
      {
        includeCurrent?: boolean;
        inheritLocale?: boolean;
        stages?: Readonly<Array<Stage>>;
      }
    >,
    selectorFn: (s: ScheduledRelease) => [...Sel],
  ): $Field<
    "documentInStages",
    Array<GetOutput<Sel>>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        includeCurrent: "Boolean!",
        inheritLocale: "Boolean!",
        stages: "[Stage!]!",
      },
      args,

      selection: selectorFn(new ScheduledRelease()),
    };
    return this.$_select("documentInStages", options as any) as any;
  }

  /**
   * Release error message
   */
  get errorMessage(): $Field<"errorMessage", string | null> {
    return this.$_select("errorMessage") as any;
  }

  /**
   * The unique identifier
   */
  get id(): $Field<"id", string> {
    return this.$_select("id") as any;
  }

  /**
   * Whether scheduled release should be run
   */
  get isActive(): $Field<"isActive", boolean> {
    return this.$_select("isActive") as any;
  }

  /**
   * Whether scheduled release is implicit
   */
  get isImplicit(): $Field<"isImplicit", boolean> {
    return this.$_select("isImplicit") as any;
  }

  /**
   * Operations to run with this release
   */
  operations<
    Args extends VariabledInput<{
      after?: string | null;
      before?: string | null;
      first?: number | null;
      forceParentLocale?: boolean | null;
      last?: number | null;
      locales?: Readonly<Array<Locale>> | null;
      orderBy?: ScheduledOperationOrderByInput | null;
      skip?: number | null;
      where?: ScheduledOperationWhereInput | null;
    }>,
    Sel extends Selection<ScheduledOperation>,
  >(
    args: ExactArgNames<
      Args,
      {
        after?: string | null;
        before?: string | null;
        first?: number | null;
        forceParentLocale?: boolean | null;
        last?: number | null;
        locales?: Readonly<Array<Locale>> | null;
        orderBy?: ScheduledOperationOrderByInput | null;
        skip?: number | null;
        where?: ScheduledOperationWhereInput | null;
      }
    >,
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<"operations", Array<GetOutput<Sel>>, GetVariables<Sel, Args>>;
  operations<Sel extends Selection<ScheduledOperation>>(
    selectorFn: (s: ScheduledOperation) => [...Sel],
  ): $Field<"operations", Array<GetOutput<Sel>>, GetVariables<Sel>>;
  operations(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        after: "String",
        before: "String",
        first: "Int",
        forceParentLocale: "Boolean",
        last: "Int",
        locales: "[Locale!]",
        orderBy: "ScheduledOperationOrderByInput",
        skip: "Int",
        where: "ScheduledOperationWhereInput",
      },
      args,

      selection: selectorFn(new ScheduledOperation()),
    };
    return this.$_select("operations", options as any) as any;
  }

  /**
   * The time the document was published. Null on documents in draft stage.
   */
  get publishedAt(): $Field<"publishedAt", DateTime | null> {
    return this.$_select("publishedAt") as any;
  }

  /**
   * User that last published this document
   */
  publishedBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"publishedBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  publishedBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"publishedBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  publishedBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("publishedBy", options as any) as any;
  }

  /**
   * Release date and time
   */
  get releaseAt(): $Field<"releaseAt", DateTime | null> {
    return this.$_select("releaseAt") as any;
  }

  /**
   * System stage field
   */
  get stage(): $Field<"stage", Stage> {
    return this.$_select("stage") as any;
  }

  /**
   * Release Status
   */
  get status(): $Field<"status", ScheduledReleaseStatus> {
    return this.$_select("status") as any;
  }

  /**
   * Release Title
   */
  get title(): $Field<"title", string | null> {
    return this.$_select("title") as any;
  }

  /**
   * The time the document was updated
   */
  get updatedAt(): $Field<"updatedAt", DateTime> {
    return this.$_select("updatedAt") as any;
  }

  /**
   * User that last updated this document
   */
  updatedBy<
    Args extends VariabledInput<{
      forceParentLocale?: boolean | null;
      locales?: Readonly<Array<Locale>> | null;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        forceParentLocale?: boolean | null;
        locales?: Readonly<Array<Locale>> | null;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<"updatedBy", GetOutput<Sel> | null, GetVariables<Sel, Args>>;
  updatedBy<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"updatedBy", GetOutput<Sel> | null, GetVariables<Sel>>;
  updatedBy(arg1: any, arg2?: any) {
    const { args, selectorFn } = !arg2
      ? { args: {}, selectorFn: arg1 }
      : { args: arg1, selectorFn: arg2 };

    const options = {
      argTypes: {
        forceParentLocale: "Boolean",
        locales: "[Locale!]",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("updatedBy", options as any) as any;
  }
}

export type ScheduledReleaseConnectInput = {
  position?: ConnectPositionInput | null;
  where: ScheduledReleaseWhereUniqueInput;
};

/**
 * A connection to a list of items.
 */
export class ScheduledReleaseConnection extends $Base<"ScheduledReleaseConnection"> {
  constructor() {
    super("ScheduledReleaseConnection");
  }

  aggregate<Sel extends Selection<Aggregate>>(
    selectorFn: (s: Aggregate) => [...Sel],
  ): $Field<"aggregate", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new Aggregate()),
    };
    return this.$_select("aggregate", options as any) as any;
  }

  /**
   * A list of edges.
   */
  edges<Sel extends Selection<ScheduledReleaseEdge>>(
    selectorFn: (s: ScheduledReleaseEdge) => [...Sel],
  ): $Field<"edges", Array<GetOutput<Sel>>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new ScheduledReleaseEdge()),
    };
    return this.$_select("edges", options as any) as any;
  }

  /**
   * Information to aid in pagination.
   */
  pageInfo<Sel extends Selection<PageInfo>>(
    selectorFn: (s: PageInfo) => [...Sel],
  ): $Field<"pageInfo", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new PageInfo()),
    };
    return this.$_select("pageInfo", options as any) as any;
  }
}

export type ScheduledReleaseCreateInput = {
  createdAt?: DateTime | null;
  description?: string | null;
  errorMessage?: string | null;
  isActive?: boolean | null;
  releaseAt?: DateTime | null;
  title?: string | null;
  updatedAt?: DateTime | null;
};

export type ScheduledReleaseCreateManyInlineInput = {
  connect?: Readonly<Array<ScheduledReleaseWhereUniqueInput>> | null;
  create?: Readonly<Array<ScheduledReleaseCreateInput>> | null;
};

export type ScheduledReleaseCreateOneInlineInput = {
  connect?: ScheduledReleaseWhereUniqueInput | null;
  create?: ScheduledReleaseCreateInput | null;
};

/**
 * An edge in a connection.
 */
export class ScheduledReleaseEdge extends $Base<"ScheduledReleaseEdge"> {
  constructor() {
    super("ScheduledReleaseEdge");
  }

  /**
   * A cursor for use in pagination.
   */
  get cursor(): $Field<"cursor", string> {
    return this.$_select("cursor") as any;
  }

  /**
   * The item at the end of the edge.
   */
  node<Sel extends Selection<ScheduledRelease>>(
    selectorFn: (s: ScheduledRelease) => [...Sel],
  ): $Field<"node", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new ScheduledRelease()),
    };
    return this.$_select("node", options as any) as any;
  }
}

/**
 * Identifies documents
 */
export type ScheduledReleaseManyWhereInput = {
  AND?: Readonly<Array<ScheduledReleaseWhereInput>> | null;
  NOT?: Readonly<Array<ScheduledReleaseWhereInput>> | null;
  OR?: Readonly<Array<ScheduledReleaseWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  createdBy?: UserWhereInput | null;
  description?: string | null;
  description_contains?: string | null;
  description_ends_with?: string | null;
  description_in?: Readonly<Array<string | null>> | null;
  description_not?: string | null;
  description_not_contains?: string | null;
  description_not_ends_with?: string | null;
  description_not_in?: Readonly<Array<string | null>> | null;
  description_not_starts_with?: string | null;
  description_starts_with?: string | null;
  errorMessage?: string | null;
  errorMessage_contains?: string | null;
  errorMessage_ends_with?: string | null;
  errorMessage_in?: Readonly<Array<string | null>> | null;
  errorMessage_not?: string | null;
  errorMessage_not_contains?: string | null;
  errorMessage_not_ends_with?: string | null;
  errorMessage_not_in?: Readonly<Array<string | null>> | null;
  errorMessage_not_starts_with?: string | null;
  errorMessage_starts_with?: string | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  isActive?: boolean | null;
  isActive_not?: boolean | null;
  isImplicit?: boolean | null;
  isImplicit_not?: boolean | null;
  operations_every?: ScheduledOperationWhereInput | null;
  operations_none?: ScheduledOperationWhereInput | null;
  operations_some?: ScheduledOperationWhereInput | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  publishedBy?: UserWhereInput | null;
  releaseAt?: DateTime | null;
  releaseAt_gt?: DateTime | null;
  releaseAt_gte?: DateTime | null;
  releaseAt_in?: Readonly<Array<DateTime | null>> | null;
  releaseAt_lt?: DateTime | null;
  releaseAt_lte?: DateTime | null;
  releaseAt_not?: DateTime | null;
  releaseAt_not_in?: Readonly<Array<DateTime | null>> | null;
  status?: ScheduledReleaseStatus | null;
  status_in?: Readonly<Array<ScheduledReleaseStatus | null>> | null;
  status_not?: ScheduledReleaseStatus | null;
  status_not_in?: Readonly<Array<ScheduledReleaseStatus | null>> | null;
  title?: string | null;
  title_contains?: string | null;
  title_ends_with?: string | null;
  title_in?: Readonly<Array<string | null>> | null;
  title_not?: string | null;
  title_not_contains?: string | null;
  title_not_ends_with?: string | null;
  title_not_in?: Readonly<Array<string | null>> | null;
  title_not_starts_with?: string | null;
  title_starts_with?: string | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedBy?: UserWhereInput | null;
};

export enum ScheduledReleaseOrderByInput {
  createdAt_ASC = "createdAt_ASC",

  createdAt_DESC = "createdAt_DESC",

  description_ASC = "description_ASC",

  description_DESC = "description_DESC",

  errorMessage_ASC = "errorMessage_ASC",

  errorMessage_DESC = "errorMessage_DESC",

  id_ASC = "id_ASC",

  id_DESC = "id_DESC",

  isActive_ASC = "isActive_ASC",

  isActive_DESC = "isActive_DESC",

  isImplicit_ASC = "isImplicit_ASC",

  isImplicit_DESC = "isImplicit_DESC",

  publishedAt_ASC = "publishedAt_ASC",

  publishedAt_DESC = "publishedAt_DESC",

  releaseAt_ASC = "releaseAt_ASC",

  releaseAt_DESC = "releaseAt_DESC",

  status_ASC = "status_ASC",

  status_DESC = "status_DESC",

  title_ASC = "title_ASC",

  title_DESC = "title_DESC",

  updatedAt_ASC = "updatedAt_ASC",

  updatedAt_DESC = "updatedAt_DESC",
}

/**
 * System Scheduled Release Status
 */
export enum ScheduledReleaseStatus {
  COMPLETED = "COMPLETED",

  FAILED = "FAILED",

  IN_PROGRESS = "IN_PROGRESS",

  PENDING = "PENDING",
}

export type ScheduledReleaseUpdateInput = {
  description?: string | null;
  errorMessage?: string | null;
  isActive?: boolean | null;
  releaseAt?: DateTime | null;
  title?: string | null;
};

export type ScheduledReleaseUpdateManyInlineInput = {
  connect?: Readonly<Array<ScheduledReleaseConnectInput>> | null;
  create?: Readonly<Array<ScheduledReleaseCreateInput>> | null;
  delete?: Readonly<Array<ScheduledReleaseWhereUniqueInput>> | null;
  disconnect?: Readonly<Array<ScheduledReleaseWhereUniqueInput>> | null;
  set?: Readonly<Array<ScheduledReleaseWhereUniqueInput>> | null;
  update?: Readonly<
    Array<ScheduledReleaseUpdateWithNestedWhereUniqueInput>
  > | null;
  upsert?: Readonly<
    Array<ScheduledReleaseUpsertWithNestedWhereUniqueInput>
  > | null;
};

export type ScheduledReleaseUpdateManyInput = {
  description?: string | null;
  errorMessage?: string | null;
  isActive?: boolean | null;
  releaseAt?: DateTime | null;
  title?: string | null;
};

export type ScheduledReleaseUpdateManyWithNestedWhereInput = {
  data: ScheduledReleaseUpdateManyInput;
  where: ScheduledReleaseWhereInput;
};

export type ScheduledReleaseUpdateOneInlineInput = {
  connect?: ScheduledReleaseWhereUniqueInput | null;
  create?: ScheduledReleaseCreateInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: ScheduledReleaseUpdateWithNestedWhereUniqueInput | null;
  upsert?: ScheduledReleaseUpsertWithNestedWhereUniqueInput | null;
};

export type ScheduledReleaseUpdateWithNestedWhereUniqueInput = {
  data: ScheduledReleaseUpdateInput;
  where: ScheduledReleaseWhereUniqueInput;
};

export type ScheduledReleaseUpsertInput = {
  create: ScheduledReleaseCreateInput;
  update: ScheduledReleaseUpdateInput;
};

export type ScheduledReleaseUpsertWithNestedWhereUniqueInput = {
  data: ScheduledReleaseUpsertInput;
  where: ScheduledReleaseWhereUniqueInput;
};

/**
 * Identifies documents
 */
export type ScheduledReleaseWhereInput = {
  AND?: Readonly<Array<ScheduledReleaseWhereInput>> | null;
  NOT?: Readonly<Array<ScheduledReleaseWhereInput>> | null;
  OR?: Readonly<Array<ScheduledReleaseWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  createdBy?: UserWhereInput | null;
  description?: string | null;
  description_contains?: string | null;
  description_ends_with?: string | null;
  description_in?: Readonly<Array<string | null>> | null;
  description_not?: string | null;
  description_not_contains?: string | null;
  description_not_ends_with?: string | null;
  description_not_in?: Readonly<Array<string | null>> | null;
  description_not_starts_with?: string | null;
  description_starts_with?: string | null;
  errorMessage?: string | null;
  errorMessage_contains?: string | null;
  errorMessage_ends_with?: string | null;
  errorMessage_in?: Readonly<Array<string | null>> | null;
  errorMessage_not?: string | null;
  errorMessage_not_contains?: string | null;
  errorMessage_not_ends_with?: string | null;
  errorMessage_not_in?: Readonly<Array<string | null>> | null;
  errorMessage_not_starts_with?: string | null;
  errorMessage_starts_with?: string | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  isActive?: boolean | null;
  isActive_not?: boolean | null;
  isImplicit?: boolean | null;
  isImplicit_not?: boolean | null;
  operations_every?: ScheduledOperationWhereInput | null;
  operations_none?: ScheduledOperationWhereInput | null;
  operations_some?: ScheduledOperationWhereInput | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  publishedBy?: UserWhereInput | null;
  releaseAt?: DateTime | null;
  releaseAt_gt?: DateTime | null;
  releaseAt_gte?: DateTime | null;
  releaseAt_in?: Readonly<Array<DateTime | null>> | null;
  releaseAt_lt?: DateTime | null;
  releaseAt_lte?: DateTime | null;
  releaseAt_not?: DateTime | null;
  releaseAt_not_in?: Readonly<Array<DateTime | null>> | null;
  status?: ScheduledReleaseStatus | null;
  status_in?: Readonly<Array<ScheduledReleaseStatus | null>> | null;
  status_not?: ScheduledReleaseStatus | null;
  status_not_in?: Readonly<Array<ScheduledReleaseStatus | null>> | null;
  title?: string | null;
  title_contains?: string | null;
  title_ends_with?: string | null;
  title_in?: Readonly<Array<string | null>> | null;
  title_not?: string | null;
  title_not_contains?: string | null;
  title_not_ends_with?: string | null;
  title_not_in?: Readonly<Array<string | null>> | null;
  title_not_starts_with?: string | null;
  title_starts_with?: string | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedBy?: UserWhereInput | null;
};

/**
 * References ScheduledRelease record uniquely
 */
export type ScheduledReleaseWhereUniqueInput = {
  id?: string | null;
};

/**
 * Stage system enumeration
 */
export enum Stage {
  /**
   * The Draft is the default stage for all your content.
   */
  DRAFT = "DRAFT",

  /**
   * The Published stage is where you can publish your content to.
   */
  PUBLISHED = "PUBLISHED",
}

export enum SystemDateTimeFieldVariation {
  BASE = "BASE",

  COMBINED = "COMBINED",

  LOCALIZATION = "LOCALIZATION",
}

export type UnpublishLocaleInput = {
  locale: Locale;
  stages: Readonly<Array<Stage>>;
};

/**
 * User system model
 */
export class User extends $Base<"User"> {
  constructor() {
    super("User");
  }

  /**
   * The time the document was created
   */
  get createdAt(): $Field<"createdAt", DateTime> {
    return this.$_select("createdAt") as any;
  }

  /**
   * Get the document in other stages
   */
  documentInStages<
    Args extends VariabledInput<{
      includeCurrent?: boolean;
      inheritLocale?: boolean;
      stages?: Readonly<Array<Stage>>;
    }>,
    Sel extends Selection<User>,
  >(
    args: ExactArgNames<
      Args,
      {
        includeCurrent?: boolean;
        inheritLocale?: boolean;
        stages?: Readonly<Array<Stage>>;
      }
    >,
    selectorFn: (s: User) => [...Sel],
  ): $Field<
    "documentInStages",
    Array<GetOutput<Sel>>,
    GetVariables<Sel, Args>
  > {
    const options = {
      argTypes: {
        includeCurrent: "Boolean!",
        inheritLocale: "Boolean!",
        stages: "[Stage!]!",
      },
      args,

      selection: selectorFn(new User()),
    };
    return this.$_select("documentInStages", options as any) as any;
  }

  /**
   * The unique identifier
   */
  get id(): $Field<"id", string> {
    return this.$_select("id") as any;
  }

  /**
   * Flag to determine if user is active or not
   */
  get isActive(): $Field<"isActive", boolean> {
    return this.$_select("isActive") as any;
  }

  /**
   * User Kind. Can be either MEMBER, PAT or PUBLIC
   */
  get kind(): $Field<"kind", UserKind> {
    return this.$_select("kind") as any;
  }

  /**
   * The username
   */
  get name(): $Field<"name", string> {
    return this.$_select("name") as any;
  }

  /**
   * Profile Picture url
   */
  get picture(): $Field<"picture", string | null> {
    return this.$_select("picture") as any;
  }

  /**
   * The time the document was published. Null on documents in draft stage.
   */
  get publishedAt(): $Field<"publishedAt", DateTime | null> {
    return this.$_select("publishedAt") as any;
  }

  /**
   * System stage field
   */
  get stage(): $Field<"stage", Stage> {
    return this.$_select("stage") as any;
  }

  /**
   * The time the document was updated
   */
  get updatedAt(): $Field<"updatedAt", DateTime> {
    return this.$_select("updatedAt") as any;
  }
}

export type UserConnectInput = {
  position?: ConnectPositionInput | null;
  where: UserWhereUniqueInput;
};

/**
 * A connection to a list of items.
 */
export class UserConnection extends $Base<"UserConnection"> {
  constructor() {
    super("UserConnection");
  }

  aggregate<Sel extends Selection<Aggregate>>(
    selectorFn: (s: Aggregate) => [...Sel],
  ): $Field<"aggregate", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new Aggregate()),
    };
    return this.$_select("aggregate", options as any) as any;
  }

  /**
   * A list of edges.
   */
  edges<Sel extends Selection<UserEdge>>(
    selectorFn: (s: UserEdge) => [...Sel],
  ): $Field<"edges", Array<GetOutput<Sel>>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new UserEdge()),
    };
    return this.$_select("edges", options as any) as any;
  }

  /**
   * Information to aid in pagination.
   */
  pageInfo<Sel extends Selection<PageInfo>>(
    selectorFn: (s: PageInfo) => [...Sel],
  ): $Field<"pageInfo", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new PageInfo()),
    };
    return this.$_select("pageInfo", options as any) as any;
  }
}

export type UserCreateManyInlineInput = {
  connect?: Readonly<Array<UserWhereUniqueInput>> | null;
};

export type UserCreateOneInlineInput = {
  connect?: UserWhereUniqueInput | null;
};

/**
 * An edge in a connection.
 */
export class UserEdge extends $Base<"UserEdge"> {
  constructor() {
    super("UserEdge");
  }

  /**
   * A cursor for use in pagination.
   */
  get cursor(): $Field<"cursor", string> {
    return this.$_select("cursor") as any;
  }

  /**
   * The item at the end of the edge.
   */
  node<Sel extends Selection<User>>(
    selectorFn: (s: User) => [...Sel],
  ): $Field<"node", GetOutput<Sel>, GetVariables<Sel>> {
    const options = {
      selection: selectorFn(new User()),
    };
    return this.$_select("node", options as any) as any;
  }
}

/**
 * System User Kind
 */
export enum UserKind {
  APP_TOKEN = "APP_TOKEN",

  MEMBER = "MEMBER",

  PAT = "PAT",

  PUBLIC = "PUBLIC",

  WEBHOOK = "WEBHOOK",
}

/**
 * Identifies documents
 */
export type UserManyWhereInput = {
  AND?: Readonly<Array<UserWhereInput>> | null;
  NOT?: Readonly<Array<UserWhereInput>> | null;
  OR?: Readonly<Array<UserWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  documentInStages_every?: UserWhereStageInput | null;
  documentInStages_none?: UserWhereStageInput | null;
  documentInStages_some?: UserWhereStageInput | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  isActive?: boolean | null;
  isActive_not?: boolean | null;
  kind?: UserKind | null;
  kind_in?: Readonly<Array<UserKind | null>> | null;
  kind_not?: UserKind | null;
  kind_not_in?: Readonly<Array<UserKind | null>> | null;
  name?: string | null;
  name_contains?: string | null;
  name_ends_with?: string | null;
  name_in?: Readonly<Array<string | null>> | null;
  name_not?: string | null;
  name_not_contains?: string | null;
  name_not_ends_with?: string | null;
  name_not_in?: Readonly<Array<string | null>> | null;
  name_not_starts_with?: string | null;
  name_starts_with?: string | null;
  picture?: string | null;
  picture_contains?: string | null;
  picture_ends_with?: string | null;
  picture_in?: Readonly<Array<string | null>> | null;
  picture_not?: string | null;
  picture_not_contains?: string | null;
  picture_not_ends_with?: string | null;
  picture_not_in?: Readonly<Array<string | null>> | null;
  picture_not_starts_with?: string | null;
  picture_starts_with?: string | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
};

export enum UserOrderByInput {
  createdAt_ASC = "createdAt_ASC",

  createdAt_DESC = "createdAt_DESC",

  id_ASC = "id_ASC",

  id_DESC = "id_DESC",

  isActive_ASC = "isActive_ASC",

  isActive_DESC = "isActive_DESC",

  kind_ASC = "kind_ASC",

  kind_DESC = "kind_DESC",

  name_ASC = "name_ASC",

  name_DESC = "name_DESC",

  picture_ASC = "picture_ASC",

  picture_DESC = "picture_DESC",

  publishedAt_ASC = "publishedAt_ASC",

  publishedAt_DESC = "publishedAt_DESC",

  updatedAt_ASC = "updatedAt_ASC",

  updatedAt_DESC = "updatedAt_DESC",
}

export type UserUpdateManyInlineInput = {
  connect?: Readonly<Array<UserConnectInput>> | null;
  disconnect?: Readonly<Array<UserWhereUniqueInput>> | null;
  set?: Readonly<Array<UserWhereUniqueInput>> | null;
};

export type UserUpdateOneInlineInput = {
  connect?: UserWhereUniqueInput | null;
  disconnect?: boolean | null;
};

/**
 * This contains a set of filters that can be used to compare values internally
 */
export type UserWhereComparatorInput = {
  outdated_to?: boolean | null;
};

/**
 * Identifies documents
 */
export type UserWhereInput = {
  AND?: Readonly<Array<UserWhereInput>> | null;
  NOT?: Readonly<Array<UserWhereInput>> | null;
  OR?: Readonly<Array<UserWhereInput>> | null;
  _search?: string | null;
  createdAt?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  createdAt_in?: Readonly<Array<DateTime | null>> | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_not_in?: Readonly<Array<DateTime | null>> | null;
  documentInStages_every?: UserWhereStageInput | null;
  documentInStages_none?: UserWhereStageInput | null;
  documentInStages_some?: UserWhereStageInput | null;
  id?: string | null;
  id_contains?: string | null;
  id_ends_with?: string | null;
  id_in?: Readonly<Array<string | null>> | null;
  id_not?: string | null;
  id_not_contains?: string | null;
  id_not_ends_with?: string | null;
  id_not_in?: Readonly<Array<string | null>> | null;
  id_not_starts_with?: string | null;
  id_starts_with?: string | null;
  isActive?: boolean | null;
  isActive_not?: boolean | null;
  kind?: UserKind | null;
  kind_in?: Readonly<Array<UserKind | null>> | null;
  kind_not?: UserKind | null;
  kind_not_in?: Readonly<Array<UserKind | null>> | null;
  name?: string | null;
  name_contains?: string | null;
  name_ends_with?: string | null;
  name_in?: Readonly<Array<string | null>> | null;
  name_not?: string | null;
  name_not_contains?: string | null;
  name_not_ends_with?: string | null;
  name_not_in?: Readonly<Array<string | null>> | null;
  name_not_starts_with?: string | null;
  name_starts_with?: string | null;
  picture?: string | null;
  picture_contains?: string | null;
  picture_ends_with?: string | null;
  picture_in?: Readonly<Array<string | null>> | null;
  picture_not?: string | null;
  picture_not_contains?: string | null;
  picture_not_ends_with?: string | null;
  picture_not_in?: Readonly<Array<string | null>> | null;
  picture_not_starts_with?: string | null;
  picture_starts_with?: string | null;
  publishedAt?: DateTime | null;
  publishedAt_gt?: DateTime | null;
  publishedAt_gte?: DateTime | null;
  publishedAt_in?: Readonly<Array<DateTime | null>> | null;
  publishedAt_lt?: DateTime | null;
  publishedAt_lte?: DateTime | null;
  publishedAt_not?: DateTime | null;
  publishedAt_not_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  updatedAt_in?: Readonly<Array<DateTime | null>> | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_not_in?: Readonly<Array<DateTime | null>> | null;
};

/**
 * The document in stages filter allows specifying a stage entry to cross compare the same document between different stages
 */
export type UserWhereStageInput = {
  AND?: Readonly<Array<UserWhereStageInput>> | null;
  NOT?: Readonly<Array<UserWhereStageInput>> | null;
  OR?: Readonly<Array<UserWhereStageInput>> | null;
  compareWithParent?: UserWhereComparatorInput | null;
  stage?: Stage | null;
};

/**
 * References User record uniquely
 */
export type UserWhereUniqueInput = {
  id?: string | null;
};

export class Version extends $Base<"Version"> {
  constructor() {
    super("Version");
  }

  get createdAt(): $Field<"createdAt", DateTime> {
    return this.$_select("createdAt") as any;
  }

  get id(): $Field<"id", string> {
    return this.$_select("id") as any;
  }

  get revision(): $Field<"revision", number> {
    return this.$_select("revision") as any;
  }

  get stage(): $Field<"stage", Stage> {
    return this.$_select("stage") as any;
  }
}

export type VersionWhereInput = {
  id: string;
  revision: number;
  stage: Stage;
};

export enum _FilterKind {
  AND = "AND",

  NOT = "NOT",

  OR = "OR",

  contains = "contains",

  contains_all = "contains_all",

  contains_none = "contains_none",

  contains_some = "contains_some",

  ends_with = "ends_with",

  eq = "eq",

  eq_not = "eq_not",

  gt = "gt",

  gte = "gte",

  in = "in",

  json_path_exists = "json_path_exists",

  json_value_recursive = "json_value_recursive",

  lt = "lt",

  lte = "lte",

  not_contains = "not_contains",

  not_ends_with = "not_ends_with",

  not_in = "not_in",

  not_starts_with = "not_starts_with",

  relational_every = "relational_every",

  relational_none = "relational_none",

  relational_single = "relational_single",

  relational_some = "relational_some",

  search = "search",

  starts_with = "starts_with",

  union_empty = "union_empty",

  union_every = "union_every",

  union_none = "union_none",

  union_single = "union_single",

  union_some = "union_some",
}

export enum _MutationInputFieldKind {
  enum = "enum",

  relation = "relation",

  richText = "richText",

  richTextWithEmbeds = "richTextWithEmbeds",

  scalar = "scalar",

  union = "union",

  virtual = "virtual",
}

export enum _MutationKind {
  create = "create",

  delete = "delete",

  deleteMany = "deleteMany",

  publish = "publish",

  publishMany = "publishMany",

  schedulePublish = "schedulePublish",

  scheduleUnpublish = "scheduleUnpublish",

  unpublish = "unpublish",

  unpublishMany = "unpublishMany",

  update = "update",

  updateMany = "updateMany",

  upsert = "upsert",
}

export enum _OrderDirection {
  asc = "asc",

  desc = "desc",
}

export enum _RelationInputCardinality {
  many = "many",

  one = "one",
}

export enum _RelationInputKind {
  create = "create",

  update = "update",
}

export enum _RelationKind {
  regular = "regular",

  union = "union",
}

export enum _SystemDateTimeFieldVariation {
  base = "base",

  combined = "combined",

  localization = "localization",
}

const $Root = {
  query: Query,
  mutation: Mutation,
};

namespace $RootTypes {
  export type query = Query;
  export type mutation = Mutation;
}

export function query<Sel extends Selection<$RootTypes.query>>(
  name: string,
  selectFn: (q: $RootTypes.query) => [...Sel],
): TypedDocumentNode<GetOutput<Sel>, GetVariables<Sel>>;
export function query<Sel extends Selection<$RootTypes.query>>(
  selectFn: (q: $RootTypes.query) => [...Sel],
): TypedDocumentNode<GetOutput<Sel>, Simplify<GetVariables<Sel>>>;
export function query<Sel extends Selection<$RootTypes.query>>(
  name: any,
  selectFn?: any,
) {
  if (!selectFn) {
    selectFn = name;
    name = "";
  }
  let field = new $Field<"query", GetOutput<Sel>, GetVariables<Sel>>("query", {
    selection: selectFn(new $Root.query()),
  });
  const str = fieldToQuery(`query ${name}`, field);

  return gql(str) as any;
}

export function mutation<Sel extends Selection<$RootTypes.mutation>>(
  name: string,
  selectFn: (q: $RootTypes.mutation) => [...Sel],
): TypedDocumentNode<GetOutput<Sel>, GetVariables<Sel>>;
export function mutation<Sel extends Selection<$RootTypes.mutation>>(
  selectFn: (q: $RootTypes.mutation) => [...Sel],
): TypedDocumentNode<GetOutput<Sel>, Simplify<GetVariables<Sel>>>;
export function mutation<Sel extends Selection<$RootTypes.query>>(
  name: any,
  selectFn?: any,
) {
  if (!selectFn) {
    selectFn = name;
    name = "";
  }
  let field = new $Field<"mutation", GetOutput<Sel>, GetVariables<Sel>>(
    "mutation",
    {
      selection: selectFn(new $Root.mutation()),
    },
  );
  const str = fieldToQuery(`mutation ${name}`, field);

  return gql(str) as any;
}

const $InputTypes: { [key: string]: { [key: string]: string } } = {
  ArticleConnectInput: {
    position: "ConnectPositionInput",
    where: "ArticleWhereUniqueInput!",
  },
  ArticleCreateInput: {
    content: "RichTextAST!",
    createdAt: "DateTime",
    slug: "String!",
    tags: "[String!]",
    title: "String!",
    updatedAt: "DateTime",
  },
  ArticleCreateManyInlineInput: {
    connect: "[ArticleWhereUniqueInput!]",
    create: "[ArticleCreateInput!]",
  },
  ArticleCreateOneInlineInput: {
    connect: "ArticleWhereUniqueInput",
    create: "ArticleCreateInput",
  },
  ArticleManyWhereInput: {
    AND: "[ArticleWhereInput!]",
    NOT: "[ArticleWhereInput!]",
    OR: "[ArticleWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    createdBy: "UserWhereInput",
    documentInStages_every: "ArticleWhereStageInput",
    documentInStages_none: "ArticleWhereStageInput",
    documentInStages_some: "ArticleWhereStageInput",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    publishedBy: "UserWhereInput",
    scheduledIn_every: "ScheduledOperationWhereInput",
    scheduledIn_none: "ScheduledOperationWhereInput",
    scheduledIn_some: "ScheduledOperationWhereInput",
    slug: "String",
    slug_contains: "String",
    slug_ends_with: "String",
    slug_in: "[String]",
    slug_not: "String",
    slug_not_contains: "String",
    slug_not_ends_with: "String",
    slug_not_in: "[String]",
    slug_not_starts_with: "String",
    slug_starts_with: "String",
    tags: "[String!]",
    tags_contains_all: "[String!]",
    tags_contains_none: "[String!]",
    tags_contains_some: "[String!]",
    tags_not: "[String!]",
    title: "String",
    title_contains: "String",
    title_ends_with: "String",
    title_in: "[String]",
    title_not: "String",
    title_not_contains: "String",
    title_not_ends_with: "String",
    title_not_in: "[String]",
    title_not_starts_with: "String",
    title_starts_with: "String",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
    updatedBy: "UserWhereInput",
  },
  ArticleUpdateInput: {
    content: "RichTextAST",
    slug: "String",
    tags: "[String!]",
    title: "String",
  },
  ArticleUpdateManyInlineInput: {
    connect: "[ArticleConnectInput!]",
    create: "[ArticleCreateInput!]",
    delete: "[ArticleWhereUniqueInput!]",
    disconnect: "[ArticleWhereUniqueInput!]",
    set: "[ArticleWhereUniqueInput!]",
    update: "[ArticleUpdateWithNestedWhereUniqueInput!]",
    upsert: "[ArticleUpsertWithNestedWhereUniqueInput!]",
  },
  ArticleUpdateManyInput: {
    content: "RichTextAST",
    tags: "[String!]",
    title: "String",
  },
  ArticleUpdateManyWithNestedWhereInput: {
    data: "ArticleUpdateManyInput!",
    where: "ArticleWhereInput!",
  },
  ArticleUpdateOneInlineInput: {
    connect: "ArticleWhereUniqueInput",
    create: "ArticleCreateInput",
    delete: "Boolean",
    disconnect: "Boolean",
    update: "ArticleUpdateWithNestedWhereUniqueInput",
    upsert: "ArticleUpsertWithNestedWhereUniqueInput",
  },
  ArticleUpdateWithNestedWhereUniqueInput: {
    data: "ArticleUpdateInput!",
    where: "ArticleWhereUniqueInput!",
  },
  ArticleUpsertInput: {
    create: "ArticleCreateInput!",
    update: "ArticleUpdateInput!",
  },
  ArticleUpsertWithNestedWhereUniqueInput: {
    data: "ArticleUpsertInput!",
    where: "ArticleWhereUniqueInput!",
  },
  ArticleWhereComparatorInput: {
    outdated_to: "Boolean",
  },
  ArticleWhereInput: {
    AND: "[ArticleWhereInput!]",
    NOT: "[ArticleWhereInput!]",
    OR: "[ArticleWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    createdBy: "UserWhereInput",
    documentInStages_every: "ArticleWhereStageInput",
    documentInStages_none: "ArticleWhereStageInput",
    documentInStages_some: "ArticleWhereStageInput",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    publishedBy: "UserWhereInput",
    scheduledIn_every: "ScheduledOperationWhereInput",
    scheduledIn_none: "ScheduledOperationWhereInput",
    scheduledIn_some: "ScheduledOperationWhereInput",
    slug: "String",
    slug_contains: "String",
    slug_ends_with: "String",
    slug_in: "[String]",
    slug_not: "String",
    slug_not_contains: "String",
    slug_not_ends_with: "String",
    slug_not_in: "[String]",
    slug_not_starts_with: "String",
    slug_starts_with: "String",
    tags: "[String!]",
    tags_contains_all: "[String!]",
    tags_contains_none: "[String!]",
    tags_contains_some: "[String!]",
    tags_not: "[String!]",
    title: "String",
    title_contains: "String",
    title_ends_with: "String",
    title_in: "[String]",
    title_not: "String",
    title_not_contains: "String",
    title_not_ends_with: "String",
    title_not_in: "[String]",
    title_not_starts_with: "String",
    title_starts_with: "String",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
    updatedBy: "UserWhereInput",
  },
  ArticleWhereStageInput: {
    AND: "[ArticleWhereStageInput!]",
    NOT: "[ArticleWhereStageInput!]",
    OR: "[ArticleWhereStageInput!]",
    compareWithParent: "ArticleWhereComparatorInput",
    stage: "Stage",
  },
  ArticleWhereUniqueInput: {
    id: "ID",
    slug: "String",
  },
  AssetConnectInput: {
    position: "ConnectPositionInput",
    where: "AssetWhereUniqueInput!",
  },
  AssetCreateInput: {
    createdAt: "DateTime",
    fileName: "String",
    localizations: "AssetCreateLocalizationsInput",
    updatedAt: "DateTime",
    uploadUrl: "String",
  },
  AssetCreateLocalizationDataInput: {
    createdAt: "DateTime",
    fileName: "String",
    updatedAt: "DateTime",
    uploadUrl: "String",
  },
  AssetCreateLocalizationInput: {
    data: "AssetCreateLocalizationDataInput!",
    locale: "Locale!",
  },
  AssetCreateLocalizationsInput: {
    create: "[AssetCreateLocalizationInput!]",
  },
  AssetCreateManyInlineInput: {
    connect: "[AssetWhereUniqueInput!]",
    create: "[AssetCreateInput!]",
  },
  AssetCreateOneInlineInput: {
    connect: "AssetWhereUniqueInput",
    create: "AssetCreateInput",
  },
  AssetManyWhereInput: {
    AND: "[AssetWhereInput!]",
    NOT: "[AssetWhereInput!]",
    OR: "[AssetWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    createdBy: "UserWhereInput",
    documentInStages_every: "AssetWhereStageInput",
    documentInStages_none: "AssetWhereStageInput",
    documentInStages_some: "AssetWhereStageInput",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    publishedBy: "UserWhereInput",
    scheduledIn_every: "ScheduledOperationWhereInput",
    scheduledIn_none: "ScheduledOperationWhereInput",
    scheduledIn_some: "ScheduledOperationWhereInput",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
    updatedBy: "UserWhereInput",
    upload: "AssetUploadWhereInput",
  },
  AssetSingleRelationWhereInput: {
    AND: "[AssetSingleRelationWhereInput!]",
    NOT: "[AssetSingleRelationWhereInput!]",
    OR: "[AssetSingleRelationWhereInput!]",
    upload: "AssetUploadWhereInput",
  },
  AssetTransformationInput: {
    document: "DocumentTransformationInput",
    image: "ImageTransformationInput",
    validateOptions: "Boolean",
  },
  AssetUpdateInput: {
    fileName: "String",
    localizations: "AssetUpdateLocalizationsInput",
    reUpload: "Boolean",
    uploadUrl: "String",
  },
  AssetUpdateLocalizationDataInput: {
    fileName: "String",
    reUpload: "Boolean",
    uploadUrl: "String",
  },
  AssetUpdateLocalizationInput: {
    data: "AssetUpdateLocalizationDataInput!",
    locale: "Locale!",
  },
  AssetUpdateLocalizationsInput: {
    create: "[AssetCreateLocalizationInput!]",
    delete: "[Locale!]",
    update: "[AssetUpdateLocalizationInput!]",
    upsert: "[AssetUpsertLocalizationInput!]",
  },
  AssetUpdateManyInlineInput: {
    connect: "[AssetConnectInput!]",
    create: "[AssetCreateInput!]",
    delete: "[AssetWhereUniqueInput!]",
    disconnect: "[AssetWhereUniqueInput!]",
    set: "[AssetWhereUniqueInput!]",
    update: "[AssetUpdateWithNestedWhereUniqueInput!]",
    upsert: "[AssetUpsertWithNestedWhereUniqueInput!]",
  },
  AssetUpdateManyInput: {
    _: "String",
  },
  AssetUpdateManyWithNestedWhereInput: {
    data: "AssetUpdateManyInput!",
    where: "AssetWhereInput!",
  },
  AssetUpdateOneInlineInput: {
    connect: "AssetWhereUniqueInput",
    create: "AssetCreateInput",
    delete: "Boolean",
    disconnect: "Boolean",
    update: "AssetUpdateWithNestedWhereUniqueInput",
    upsert: "AssetUpsertWithNestedWhereUniqueInput",
  },
  AssetUpdateWithNestedWhereUniqueInput: {
    data: "AssetUpdateInput!",
    where: "AssetWhereUniqueInput!",
  },
  AssetUploadWhereInput: {
    AND: "[AssetUploadWhereInput!]",
    NOT: "[AssetUploadWhereInput!]",
    OR: "[AssetUploadWhereInput!]",
    expiresAt: "DateTime",
    expiresAt_gt: "DateTime",
    expiresAt_gte: "DateTime",
    expiresAt_in: "[DateTime]",
    expiresAt_lt: "DateTime",
    expiresAt_lte: "DateTime",
    expiresAt_not: "DateTime",
    expiresAt_not_in: "[DateTime]",
    status: "AssetUploadStatus",
    status_in: "[AssetUploadStatus]",
    status_not: "AssetUploadStatus",
    status_not_in: "[AssetUploadStatus]",
  },
  AssetUploadWhereStageInput: {
    AND: "[AssetUploadWhereInput!]",
    NOT: "[AssetUploadWhereInput!]",
    OR: "[AssetUploadWhereInput!]",
    expiresAt: "DateTime",
    expiresAt_gt: "DateTime",
    expiresAt_gte: "DateTime",
    expiresAt_in: "[DateTime]",
    expiresAt_lt: "DateTime",
    expiresAt_lte: "DateTime",
    expiresAt_not: "DateTime",
    expiresAt_not_in: "[DateTime]",
    status: "AssetUploadStatus",
    status_in: "[AssetUploadStatus]",
    status_not: "AssetUploadStatus",
    status_not_in: "[AssetUploadStatus]",
  },
  AssetUpsertInput: {
    create: "AssetCreateInput!",
    update: "AssetUpdateInput!",
  },
  AssetUpsertLocalizationInput: {
    create: "AssetCreateLocalizationDataInput!",
    locale: "Locale!",
    update: "AssetUpdateLocalizationDataInput!",
  },
  AssetUpsertWithNestedWhereUniqueInput: {
    data: "AssetUpsertInput!",
    where: "AssetWhereUniqueInput!",
  },
  AssetWhereComparatorInput: {
    outdated_to: "Boolean",
  },
  AssetWhereInput: {
    AND: "[AssetWhereInput!]",
    NOT: "[AssetWhereInput!]",
    OR: "[AssetWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    createdBy: "UserWhereInput",
    documentInStages_every: "AssetWhereStageInput",
    documentInStages_none: "AssetWhereStageInput",
    documentInStages_some: "AssetWhereStageInput",
    fileName: "String",
    fileName_contains: "String",
    fileName_ends_with: "String",
    fileName_in: "[String]",
    fileName_not: "String",
    fileName_not_contains: "String",
    fileName_not_ends_with: "String",
    fileName_not_in: "[String]",
    fileName_not_starts_with: "String",
    fileName_starts_with: "String",
    handle: "String",
    handle_contains: "String",
    handle_ends_with: "String",
    handle_in: "[String]",
    handle_not: "String",
    handle_not_contains: "String",
    handle_not_ends_with: "String",
    handle_not_in: "[String]",
    handle_not_starts_with: "String",
    handle_starts_with: "String",
    height: "Float",
    height_gt: "Float",
    height_gte: "Float",
    height_in: "[Float]",
    height_lt: "Float",
    height_lte: "Float",
    height_not: "Float",
    height_not_in: "[Float]",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    mimeType: "String",
    mimeType_contains: "String",
    mimeType_ends_with: "String",
    mimeType_in: "[String]",
    mimeType_not: "String",
    mimeType_not_contains: "String",
    mimeType_not_ends_with: "String",
    mimeType_not_in: "[String]",
    mimeType_not_starts_with: "String",
    mimeType_starts_with: "String",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    publishedBy: "UserWhereInput",
    scheduledIn_every: "ScheduledOperationWhereInput",
    scheduledIn_none: "ScheduledOperationWhereInput",
    scheduledIn_some: "ScheduledOperationWhereInput",
    size: "Float",
    size_gt: "Float",
    size_gte: "Float",
    size_in: "[Float]",
    size_lt: "Float",
    size_lte: "Float",
    size_not: "Float",
    size_not_in: "[Float]",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
    updatedBy: "UserWhereInput",
    upload: "AssetUploadWhereInput",
    width: "Float",
    width_gt: "Float",
    width_gte: "Float",
    width_in: "[Float]",
    width_lt: "Float",
    width_lte: "Float",
    width_not: "Float",
    width_not_in: "[Float]",
  },
  AssetWhereStageInput: {
    AND: "[AssetWhereStageInput!]",
    NOT: "[AssetWhereStageInput!]",
    OR: "[AssetWhereStageInput!]",
    compareWithParent: "AssetWhereComparatorInput",
    stage: "Stage",
  },
  AssetWhereUniqueInput: {
    id: "ID",
  },
  ColorInput: {
    hex: "Hex",
    rgba: "RGBAInput",
  },
  ConnectPositionInput: {
    after: "ID",
    before: "ID",
    end: "Boolean",
    start: "Boolean",
  },
  DocumentOutputInput: {
    format: "DocumentFileTypes",
  },
  DocumentTransformationInput: {
    output: "DocumentOutputInput",
  },
  EntityWhereInput: {
    id: "ID!",
    locale: "Locale",
    stage: "Stage!",
    typename: "EntityTypeName!",
  },
  ImageBlurInput: {
    amount: "Int!",
  },
  ImageBorderInput: {
    background: "String!",
    color: "String!",
    width: "Int!",
  },
  ImageCompressInput: {
    metadata: "Boolean!",
  },
  ImageCropInput: {
    height: "Int!",
    width: "Int!",
    x: "Int!",
    y: "Int!",
  },
  ImageQualityInput: {
    value: "Int!",
  },
  ImageResizeInput: {
    fit: "ImageFit",
    height: "Int",
    width: "Int",
  },
  ImageSharpenInput: {
    amount: "Int!",
  },
  ImageTransformationInput: {
    blur: "ImageBlurInput",
    border: "ImageBorderInput",
    compress: "ImageCompressInput",
    crop: "ImageCropInput",
    quality: "ImageQualityInput",
    resize: "ImageResizeInput",
    sharpen: "ImageSharpenInput",
  },
  LocationInput: {
    latitude: "Float!",
    longitude: "Float!",
  },
  PitchConnectInput: {
    position: "ConnectPositionInput",
    where: "PitchWhereUniqueInput!",
  },
  PitchCreateInput: {
    content: "RichTextAST!",
    createdAt: "DateTime",
    title: "String!",
    updatedAt: "DateTime",
  },
  PitchCreateManyInlineInput: {
    connect: "[PitchWhereUniqueInput!]",
    create: "[PitchCreateInput!]",
  },
  PitchCreateOneInlineInput: {
    connect: "PitchWhereUniqueInput",
    create: "PitchCreateInput",
  },
  PitchManyWhereInput: {
    AND: "[PitchWhereInput!]",
    NOT: "[PitchWhereInput!]",
    OR: "[PitchWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    createdBy: "UserWhereInput",
    documentInStages_every: "PitchWhereStageInput",
    documentInStages_none: "PitchWhereStageInput",
    documentInStages_some: "PitchWhereStageInput",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    publishedBy: "UserWhereInput",
    scheduledIn_every: "ScheduledOperationWhereInput",
    scheduledIn_none: "ScheduledOperationWhereInput",
    scheduledIn_some: "ScheduledOperationWhereInput",
    title: "String",
    title_contains: "String",
    title_ends_with: "String",
    title_in: "[String]",
    title_not: "String",
    title_not_contains: "String",
    title_not_ends_with: "String",
    title_not_in: "[String]",
    title_not_starts_with: "String",
    title_starts_with: "String",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
    updatedBy: "UserWhereInput",
  },
  PitchUpdateInput: {
    content: "RichTextAST",
    title: "String",
  },
  PitchUpdateManyInlineInput: {
    connect: "[PitchConnectInput!]",
    create: "[PitchCreateInput!]",
    delete: "[PitchWhereUniqueInput!]",
    disconnect: "[PitchWhereUniqueInput!]",
    set: "[PitchWhereUniqueInput!]",
    update: "[PitchUpdateWithNestedWhereUniqueInput!]",
    upsert: "[PitchUpsertWithNestedWhereUniqueInput!]",
  },
  PitchUpdateManyInput: {
    content: "RichTextAST",
    title: "String",
  },
  PitchUpdateManyWithNestedWhereInput: {
    data: "PitchUpdateManyInput!",
    where: "PitchWhereInput!",
  },
  PitchUpdateOneInlineInput: {
    connect: "PitchWhereUniqueInput",
    create: "PitchCreateInput",
    delete: "Boolean",
    disconnect: "Boolean",
    update: "PitchUpdateWithNestedWhereUniqueInput",
    upsert: "PitchUpsertWithNestedWhereUniqueInput",
  },
  PitchUpdateWithNestedWhereUniqueInput: {
    data: "PitchUpdateInput!",
    where: "PitchWhereUniqueInput!",
  },
  PitchUpsertInput: {
    create: "PitchCreateInput!",
    update: "PitchUpdateInput!",
  },
  PitchUpsertWithNestedWhereUniqueInput: {
    data: "PitchUpsertInput!",
    where: "PitchWhereUniqueInput!",
  },
  PitchWhereComparatorInput: {
    outdated_to: "Boolean",
  },
  PitchWhereInput: {
    AND: "[PitchWhereInput!]",
    NOT: "[PitchWhereInput!]",
    OR: "[PitchWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    createdBy: "UserWhereInput",
    documentInStages_every: "PitchWhereStageInput",
    documentInStages_none: "PitchWhereStageInput",
    documentInStages_some: "PitchWhereStageInput",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    publishedBy: "UserWhereInput",
    scheduledIn_every: "ScheduledOperationWhereInput",
    scheduledIn_none: "ScheduledOperationWhereInput",
    scheduledIn_some: "ScheduledOperationWhereInput",
    title: "String",
    title_contains: "String",
    title_ends_with: "String",
    title_in: "[String]",
    title_not: "String",
    title_not_contains: "String",
    title_not_ends_with: "String",
    title_not_in: "[String]",
    title_not_starts_with: "String",
    title_starts_with: "String",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
    updatedBy: "UserWhereInput",
  },
  PitchWhereStageInput: {
    AND: "[PitchWhereStageInput!]",
    NOT: "[PitchWhereStageInput!]",
    OR: "[PitchWhereStageInput!]",
    compareWithParent: "PitchWhereComparatorInput",
    stage: "Stage",
  },
  PitchWhereUniqueInput: {
    id: "ID",
  },
  PublishLocaleInput: {
    locale: "Locale!",
    stages: "[Stage!]!",
  },
  RGBAInput: {
    a: "RGBATransparency!",
    b: "RGBAHue!",
    g: "RGBAHue!",
    r: "RGBAHue!",
  },
  ScheduledOperationConnectInput: {
    position: "ConnectPositionInput",
    where: "ScheduledOperationWhereUniqueInput!",
  },
  ScheduledOperationCreateManyInlineInput: {
    connect: "[ScheduledOperationWhereUniqueInput!]",
  },
  ScheduledOperationCreateOneInlineInput: {
    connect: "ScheduledOperationWhereUniqueInput",
  },
  ScheduledOperationManyWhereInput: {
    AND: "[ScheduledOperationWhereInput!]",
    NOT: "[ScheduledOperationWhereInput!]",
    OR: "[ScheduledOperationWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    createdBy: "UserWhereInput",
    description: "String",
    description_contains: "String",
    description_ends_with: "String",
    description_in: "[String]",
    description_not: "String",
    description_not_contains: "String",
    description_not_ends_with: "String",
    description_not_in: "[String]",
    description_not_starts_with: "String",
    description_starts_with: "String",
    errorMessage: "String",
    errorMessage_contains: "String",
    errorMessage_ends_with: "String",
    errorMessage_in: "[String]",
    errorMessage_not: "String",
    errorMessage_not_contains: "String",
    errorMessage_not_ends_with: "String",
    errorMessage_not_in: "[String]",
    errorMessage_not_starts_with: "String",
    errorMessage_starts_with: "String",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    publishedBy: "UserWhereInput",
    rawPayload_json_path_exists: "String",
    rawPayload_value_recursive: "Json",
    release: "ScheduledReleaseWhereInput",
    status: "ScheduledOperationStatus",
    status_in: "[ScheduledOperationStatus]",
    status_not: "ScheduledOperationStatus",
    status_not_in: "[ScheduledOperationStatus]",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
    updatedBy: "UserWhereInput",
  },
  ScheduledOperationUpdateManyInlineInput: {
    connect: "[ScheduledOperationConnectInput!]",
    disconnect: "[ScheduledOperationWhereUniqueInput!]",
    set: "[ScheduledOperationWhereUniqueInput!]",
  },
  ScheduledOperationUpdateOneInlineInput: {
    connect: "ScheduledOperationWhereUniqueInput",
    disconnect: "Boolean",
  },
  ScheduledOperationWhereInput: {
    AND: "[ScheduledOperationWhereInput!]",
    NOT: "[ScheduledOperationWhereInput!]",
    OR: "[ScheduledOperationWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    createdBy: "UserWhereInput",
    description: "String",
    description_contains: "String",
    description_ends_with: "String",
    description_in: "[String]",
    description_not: "String",
    description_not_contains: "String",
    description_not_ends_with: "String",
    description_not_in: "[String]",
    description_not_starts_with: "String",
    description_starts_with: "String",
    errorMessage: "String",
    errorMessage_contains: "String",
    errorMessage_ends_with: "String",
    errorMessage_in: "[String]",
    errorMessage_not: "String",
    errorMessage_not_contains: "String",
    errorMessage_not_ends_with: "String",
    errorMessage_not_in: "[String]",
    errorMessage_not_starts_with: "String",
    errorMessage_starts_with: "String",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    publishedBy: "UserWhereInput",
    rawPayload_json_path_exists: "String",
    rawPayload_value_recursive: "Json",
    release: "ScheduledReleaseWhereInput",
    status: "ScheduledOperationStatus",
    status_in: "[ScheduledOperationStatus]",
    status_not: "ScheduledOperationStatus",
    status_not_in: "[ScheduledOperationStatus]",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
    updatedBy: "UserWhereInput",
  },
  ScheduledOperationWhereUniqueInput: {
    id: "ID",
  },
  ScheduledReleaseConnectInput: {
    position: "ConnectPositionInput",
    where: "ScheduledReleaseWhereUniqueInput!",
  },
  ScheduledReleaseCreateInput: {
    createdAt: "DateTime",
    description: "String",
    errorMessage: "String",
    isActive: "Boolean",
    releaseAt: "DateTime",
    title: "String",
    updatedAt: "DateTime",
  },
  ScheduledReleaseCreateManyInlineInput: {
    connect: "[ScheduledReleaseWhereUniqueInput!]",
    create: "[ScheduledReleaseCreateInput!]",
  },
  ScheduledReleaseCreateOneInlineInput: {
    connect: "ScheduledReleaseWhereUniqueInput",
    create: "ScheduledReleaseCreateInput",
  },
  ScheduledReleaseManyWhereInput: {
    AND: "[ScheduledReleaseWhereInput!]",
    NOT: "[ScheduledReleaseWhereInput!]",
    OR: "[ScheduledReleaseWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    createdBy: "UserWhereInput",
    description: "String",
    description_contains: "String",
    description_ends_with: "String",
    description_in: "[String]",
    description_not: "String",
    description_not_contains: "String",
    description_not_ends_with: "String",
    description_not_in: "[String]",
    description_not_starts_with: "String",
    description_starts_with: "String",
    errorMessage: "String",
    errorMessage_contains: "String",
    errorMessage_ends_with: "String",
    errorMessage_in: "[String]",
    errorMessage_not: "String",
    errorMessage_not_contains: "String",
    errorMessage_not_ends_with: "String",
    errorMessage_not_in: "[String]",
    errorMessage_not_starts_with: "String",
    errorMessage_starts_with: "String",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    isActive: "Boolean",
    isActive_not: "Boolean",
    isImplicit: "Boolean",
    isImplicit_not: "Boolean",
    operations_every: "ScheduledOperationWhereInput",
    operations_none: "ScheduledOperationWhereInput",
    operations_some: "ScheduledOperationWhereInput",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    publishedBy: "UserWhereInput",
    releaseAt: "DateTime",
    releaseAt_gt: "DateTime",
    releaseAt_gte: "DateTime",
    releaseAt_in: "[DateTime]",
    releaseAt_lt: "DateTime",
    releaseAt_lte: "DateTime",
    releaseAt_not: "DateTime",
    releaseAt_not_in: "[DateTime]",
    status: "ScheduledReleaseStatus",
    status_in: "[ScheduledReleaseStatus]",
    status_not: "ScheduledReleaseStatus",
    status_not_in: "[ScheduledReleaseStatus]",
    title: "String",
    title_contains: "String",
    title_ends_with: "String",
    title_in: "[String]",
    title_not: "String",
    title_not_contains: "String",
    title_not_ends_with: "String",
    title_not_in: "[String]",
    title_not_starts_with: "String",
    title_starts_with: "String",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
    updatedBy: "UserWhereInput",
  },
  ScheduledReleaseUpdateInput: {
    description: "String",
    errorMessage: "String",
    isActive: "Boolean",
    releaseAt: "DateTime",
    title: "String",
  },
  ScheduledReleaseUpdateManyInlineInput: {
    connect: "[ScheduledReleaseConnectInput!]",
    create: "[ScheduledReleaseCreateInput!]",
    delete: "[ScheduledReleaseWhereUniqueInput!]",
    disconnect: "[ScheduledReleaseWhereUniqueInput!]",
    set: "[ScheduledReleaseWhereUniqueInput!]",
    update: "[ScheduledReleaseUpdateWithNestedWhereUniqueInput!]",
    upsert: "[ScheduledReleaseUpsertWithNestedWhereUniqueInput!]",
  },
  ScheduledReleaseUpdateManyInput: {
    description: "String",
    errorMessage: "String",
    isActive: "Boolean",
    releaseAt: "DateTime",
    title: "String",
  },
  ScheduledReleaseUpdateManyWithNestedWhereInput: {
    data: "ScheduledReleaseUpdateManyInput!",
    where: "ScheduledReleaseWhereInput!",
  },
  ScheduledReleaseUpdateOneInlineInput: {
    connect: "ScheduledReleaseWhereUniqueInput",
    create: "ScheduledReleaseCreateInput",
    delete: "Boolean",
    disconnect: "Boolean",
    update: "ScheduledReleaseUpdateWithNestedWhereUniqueInput",
    upsert: "ScheduledReleaseUpsertWithNestedWhereUniqueInput",
  },
  ScheduledReleaseUpdateWithNestedWhereUniqueInput: {
    data: "ScheduledReleaseUpdateInput!",
    where: "ScheduledReleaseWhereUniqueInput!",
  },
  ScheduledReleaseUpsertInput: {
    create: "ScheduledReleaseCreateInput!",
    update: "ScheduledReleaseUpdateInput!",
  },
  ScheduledReleaseUpsertWithNestedWhereUniqueInput: {
    data: "ScheduledReleaseUpsertInput!",
    where: "ScheduledReleaseWhereUniqueInput!",
  },
  ScheduledReleaseWhereInput: {
    AND: "[ScheduledReleaseWhereInput!]",
    NOT: "[ScheduledReleaseWhereInput!]",
    OR: "[ScheduledReleaseWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    createdBy: "UserWhereInput",
    description: "String",
    description_contains: "String",
    description_ends_with: "String",
    description_in: "[String]",
    description_not: "String",
    description_not_contains: "String",
    description_not_ends_with: "String",
    description_not_in: "[String]",
    description_not_starts_with: "String",
    description_starts_with: "String",
    errorMessage: "String",
    errorMessage_contains: "String",
    errorMessage_ends_with: "String",
    errorMessage_in: "[String]",
    errorMessage_not: "String",
    errorMessage_not_contains: "String",
    errorMessage_not_ends_with: "String",
    errorMessage_not_in: "[String]",
    errorMessage_not_starts_with: "String",
    errorMessage_starts_with: "String",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    isActive: "Boolean",
    isActive_not: "Boolean",
    isImplicit: "Boolean",
    isImplicit_not: "Boolean",
    operations_every: "ScheduledOperationWhereInput",
    operations_none: "ScheduledOperationWhereInput",
    operations_some: "ScheduledOperationWhereInput",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    publishedBy: "UserWhereInput",
    releaseAt: "DateTime",
    releaseAt_gt: "DateTime",
    releaseAt_gte: "DateTime",
    releaseAt_in: "[DateTime]",
    releaseAt_lt: "DateTime",
    releaseAt_lte: "DateTime",
    releaseAt_not: "DateTime",
    releaseAt_not_in: "[DateTime]",
    status: "ScheduledReleaseStatus",
    status_in: "[ScheduledReleaseStatus]",
    status_not: "ScheduledReleaseStatus",
    status_not_in: "[ScheduledReleaseStatus]",
    title: "String",
    title_contains: "String",
    title_ends_with: "String",
    title_in: "[String]",
    title_not: "String",
    title_not_contains: "String",
    title_not_ends_with: "String",
    title_not_in: "[String]",
    title_not_starts_with: "String",
    title_starts_with: "String",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
    updatedBy: "UserWhereInput",
  },
  ScheduledReleaseWhereUniqueInput: {
    id: "ID",
  },
  UnpublishLocaleInput: {
    locale: "Locale!",
    stages: "[Stage!]!",
  },
  UserConnectInput: {
    position: "ConnectPositionInput",
    where: "UserWhereUniqueInput!",
  },
  UserCreateManyInlineInput: {
    connect: "[UserWhereUniqueInput!]",
  },
  UserCreateOneInlineInput: {
    connect: "UserWhereUniqueInput",
  },
  UserManyWhereInput: {
    AND: "[UserWhereInput!]",
    NOT: "[UserWhereInput!]",
    OR: "[UserWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    documentInStages_every: "UserWhereStageInput",
    documentInStages_none: "UserWhereStageInput",
    documentInStages_some: "UserWhereStageInput",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    isActive: "Boolean",
    isActive_not: "Boolean",
    kind: "UserKind",
    kind_in: "[UserKind]",
    kind_not: "UserKind",
    kind_not_in: "[UserKind]",
    name: "String",
    name_contains: "String",
    name_ends_with: "String",
    name_in: "[String]",
    name_not: "String",
    name_not_contains: "String",
    name_not_ends_with: "String",
    name_not_in: "[String]",
    name_not_starts_with: "String",
    name_starts_with: "String",
    picture: "String",
    picture_contains: "String",
    picture_ends_with: "String",
    picture_in: "[String]",
    picture_not: "String",
    picture_not_contains: "String",
    picture_not_ends_with: "String",
    picture_not_in: "[String]",
    picture_not_starts_with: "String",
    picture_starts_with: "String",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
  },
  UserUpdateManyInlineInput: {
    connect: "[UserConnectInput!]",
    disconnect: "[UserWhereUniqueInput!]",
    set: "[UserWhereUniqueInput!]",
  },
  UserUpdateOneInlineInput: {
    connect: "UserWhereUniqueInput",
    disconnect: "Boolean",
  },
  UserWhereComparatorInput: {
    outdated_to: "Boolean",
  },
  UserWhereInput: {
    AND: "[UserWhereInput!]",
    NOT: "[UserWhereInput!]",
    OR: "[UserWhereInput!]",
    _search: "String",
    createdAt: "DateTime",
    createdAt_gt: "DateTime",
    createdAt_gte: "DateTime",
    createdAt_in: "[DateTime]",
    createdAt_lt: "DateTime",
    createdAt_lte: "DateTime",
    createdAt_not: "DateTime",
    createdAt_not_in: "[DateTime]",
    documentInStages_every: "UserWhereStageInput",
    documentInStages_none: "UserWhereStageInput",
    documentInStages_some: "UserWhereStageInput",
    id: "ID",
    id_contains: "ID",
    id_ends_with: "ID",
    id_in: "[ID]",
    id_not: "ID",
    id_not_contains: "ID",
    id_not_ends_with: "ID",
    id_not_in: "[ID]",
    id_not_starts_with: "ID",
    id_starts_with: "ID",
    isActive: "Boolean",
    isActive_not: "Boolean",
    kind: "UserKind",
    kind_in: "[UserKind]",
    kind_not: "UserKind",
    kind_not_in: "[UserKind]",
    name: "String",
    name_contains: "String",
    name_ends_with: "String",
    name_in: "[String]",
    name_not: "String",
    name_not_contains: "String",
    name_not_ends_with: "String",
    name_not_in: "[String]",
    name_not_starts_with: "String",
    name_starts_with: "String",
    picture: "String",
    picture_contains: "String",
    picture_ends_with: "String",
    picture_in: "[String]",
    picture_not: "String",
    picture_not_contains: "String",
    picture_not_ends_with: "String",
    picture_not_in: "[String]",
    picture_not_starts_with: "String",
    picture_starts_with: "String",
    publishedAt: "DateTime",
    publishedAt_gt: "DateTime",
    publishedAt_gte: "DateTime",
    publishedAt_in: "[DateTime]",
    publishedAt_lt: "DateTime",
    publishedAt_lte: "DateTime",
    publishedAt_not: "DateTime",
    publishedAt_not_in: "[DateTime]",
    updatedAt: "DateTime",
    updatedAt_gt: "DateTime",
    updatedAt_gte: "DateTime",
    updatedAt_in: "[DateTime]",
    updatedAt_lt: "DateTime",
    updatedAt_lte: "DateTime",
    updatedAt_not: "DateTime",
    updatedAt_not_in: "[DateTime]",
  },
  UserWhereStageInput: {
    AND: "[UserWhereStageInput!]",
    NOT: "[UserWhereStageInput!]",
    OR: "[UserWhereStageInput!]",
    compareWithParent: "UserWhereComparatorInput",
    stage: "Stage",
  },
  UserWhereUniqueInput: {
    id: "ID",
  },
  VersionWhereInput: {
    id: "ID!",
    revision: "Int!",
    stage: "Stage!",
  },
};
