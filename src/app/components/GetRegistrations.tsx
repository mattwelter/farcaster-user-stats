export default async function Registrations() {

    const response = await fetch('https://localhost:3000/api/optimism_registers');
    const jsonData = await response.json();
    console.log(jsonData)

    return (
        <>
            <div>
                
            </div>
        </>
    )
}