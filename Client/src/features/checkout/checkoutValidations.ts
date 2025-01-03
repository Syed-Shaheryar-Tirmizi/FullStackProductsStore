import * as yup from 'yup'

export const validationSchema =[
    yup.object({
        fullName: yup.string().required('Full name is required'),
        addressLine1: yup.string().required('Address Line 1 is required'),
        city: yup.string().required('City is required'),
        state: yup.string().required('State is required'),
        zipCode: yup.string().required('Zip Code is required'),
        country: yup.string().required('Country is required')
    }),
    yup.object({}),
    yup.object({
        nameOnCard: yup.string().required('Name on card is required'),
    })
]