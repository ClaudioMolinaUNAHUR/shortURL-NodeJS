console.log("hola soy frontend")
document.addEventListener('click', e=>{
    if(e.target.dataset.short){
        const url = `http://localhost:5000/${e.target.dataset.short}`;

        navigator.clipboard //permite copiar un text con un click, osea durante evento. pertenece a las api default de JS
            .writeText(url)
            .then(() => {
                console.log("Text copied to clipboard...");
            })
            .catch((err) => {
                console.log("Something went wrong", err);
            });
    }
})