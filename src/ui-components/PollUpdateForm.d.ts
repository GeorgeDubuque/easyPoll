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
export declare type PollUpdateFormInputValues = {
    creatorId?: string;
    createdAt?: string;
    description?: string;
};
export declare type PollUpdateFormValidationValues = {
    creatorId?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PollUpdateFormOverridesProps = {
    PollUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    creatorId?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PollUpdateFormProps = React.PropsWithChildren<{
    overrides?: PollUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    poll?: any;
    onSubmit?: (fields: PollUpdateFormInputValues) => PollUpdateFormInputValues;
    onSuccess?: (fields: PollUpdateFormInputValues) => void;
    onError?: (fields: PollUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PollUpdateFormInputValues) => PollUpdateFormInputValues;
    onValidate?: PollUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PollUpdateForm(props: PollUpdateFormProps): React.ReactElement;
