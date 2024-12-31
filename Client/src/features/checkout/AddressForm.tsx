import { Typography, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckbox from "../../app/components/AppCheckbox";

export default function AddressForm() {
  const { control, formState: { isDirty } } = useFormContext();
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <AppTextInput control={control} name="fullName" label="Full Name" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="addressLine1" label="Address line 1" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="addressLine2" label="Address line 2" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="city" label="City" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="state" label="State" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="zipCode" label="Zip Code" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="country" label="Country" />
        </Grid>
        <Grid item xs={12}>
          <AppCheckbox
            disabled={!isDirty}
            control={control}
            name="saveAddress"
            label="Save this as the default address" />
        </Grid>
      </Grid>
    </>
  );
}
