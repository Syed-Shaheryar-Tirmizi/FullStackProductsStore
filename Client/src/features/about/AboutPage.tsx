import { Button, ButtonGroup, Container, Typography } from "@mui/material";
import agent from "../../app/api/agent";

export default function AboutPage(){
    return(
        <Container>
            <Typography gutterBottom variant="h2" align="center">Error Validation (Testing purposes)</Typography>
            <ButtonGroup fullWidth>
                <Button variant="contained" onClick={() =>agent.testErrors.get400Error().catch(error => console.log(error))}>Test 400 error</Button>
                <Button variant="contained" onClick={() =>agent.testErrors.get401Error().catch(error => console.log(error))}>Test 401 error</Button>
                <Button variant="contained" onClick={() =>agent.testErrors.get404Error().catch(error => console.log(error))}>Test 404 error</Button>
                <Button variant="contained" onClick={() =>agent.testErrors.get500Error().catch(error => console.log(error))}>Test 500 error</Button>
                <Button variant="contained" onClick={() =>agent.testErrors.getValidationError().catch(error => console.log(error))}>Test validation errors</Button>
            </ButtonGroup>
        </Container>
    )
}