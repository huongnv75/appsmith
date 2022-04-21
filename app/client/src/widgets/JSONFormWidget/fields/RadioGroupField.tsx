import React, { useCallback, useContext } from "react";
import { Alignment } from "@blueprintjs/core";
import { useController } from "react-hook-form";

import FormContext from "../FormContext";
import Field from "widgets/JSONFormWidget/component/Field";
import RadioGroupComponent from "widgets/RadioGroupWidget/component";
import useRegisterFieldValidity from "./useRegisterFieldValidity";
import { RadioOption } from "widgets/RadioGroupWidget/constants";
import { BaseFieldComponentProps, FieldComponentBaseProps } from "../constants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";

type RadioGroupComponentProps = FieldComponentBaseProps & {
  options: RadioOption[];
  onSelectionChange?: string;
};

export type RadioGroupFieldProps = BaseFieldComponentProps<
  RadioGroupComponentProps
>;

const COMPONENT_DEFAULT_VALUES: RadioGroupComponentProps = {
  isDisabled: false,
  isRequired: false,
  isVisible: true,
  label: "",
  options: [
    { label: "Yes", value: "Y" },
    { label: "No", value: "N" },
  ],
};

const isValid = (
  schemaItem: RadioGroupFieldProps["schemaItem"],
  value?: string,
) => !schemaItem.isRequired || Boolean(value);

function RadioGroupField({
  fieldClassName,
  name,
  passedDefaultValue,
  schemaItem,
}: RadioGroupFieldProps) {
  const { executeAction } = useContext(FormContext);
  const fieldDefaultValue = passedDefaultValue || schemaItem.defaultValue;
  const {
    field: { onChange, value },
  } = useController({
    defaultValue: fieldDefaultValue,
    name,
  });

  const isValueValid = isValid(schemaItem, value);

  useRegisterFieldValidity({
    isValid: isValueValid,
    fieldName: name,
    fieldType: schemaItem.fieldType,
  });

  const onSelectionChange = useCallback(
    (selectedValue: string) => {
      onChange(selectedValue);

      if (schemaItem.onSelectionChange && executeAction) {
        executeAction({
          triggerPropertyName: "onSelectionOptionChange",
          dynamicString: schemaItem.onSelectionChange,
          event: {
            type: EventType.ON_OPTION_CHANGE,
          },
        });
      }
    },
    [onChange, executeAction, schemaItem.onSelectionChange],
  );

  return (
    <Field
      accessor={schemaItem.accessor}
      defaultValue={fieldDefaultValue}
      fieldClassName={fieldClassName}
      isRequiredField={schemaItem.isRequired}
      label={schemaItem.label}
      labelStyle={schemaItem.labelStyle}
      labelTextColor={schemaItem.labelTextColor}
      labelTextSize={schemaItem.labelTextSize}
      name={name}
      tooltip={schemaItem.tooltip}
    >
      <RadioGroupComponent
        alignment={Alignment.LEFT}
        compactMode={false}
        disabled={schemaItem.isDisabled}
        inline={false}
        labelText=""
        loading={false}
        onRadioSelectionChange={onSelectionChange}
        options={schemaItem.options || []}
        selectedOptionValue={value}
        widgetId=""
      />
    </Field>
  );
}

RadioGroupField.componentDefaultValues = COMPONENT_DEFAULT_VALUES;

export default RadioGroupField;
