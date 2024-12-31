import { Checkbox, FormControlLabel } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps {
    label: string
}

export default function AppCheckbox(props: Props) {
    const { field } = useController({ ...props, defaultValue: false });

    return (
        <FormControlLabel control={<Checkbox {...field} color="secondary" checked={field.value} />} label={props.label} />
    );
}