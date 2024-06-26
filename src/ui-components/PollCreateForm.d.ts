/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type PollCreateFormInputValues = {
    creatorId?: string;
    createdAt?: string;
    description?: string;
};
export declare type PollCreateFormValidationValues = {
    creatorId?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PollCreateFormOverridesProps = {
    PollCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    creatorId?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PollCreateFormProps = React.PropsWithChildren<{
    overrides?: PollCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PollCreateFormInputValues) => PollCreateFormInputValues;
    onSuccess?: (fields: PollCreateFormInputValues) => void;
    onError?: (fields: PollCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PollCreateFormInputValues) => PollCreateFormInputValues;
    onValidate?: PollCreateFormValidationValues;
} & React.CSSProperties>;
export default function PollCreateForm(props: PollCreateFormProps): React.ReactElement;
