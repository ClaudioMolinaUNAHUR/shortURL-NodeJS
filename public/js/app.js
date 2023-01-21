console.log("hola soy frontend")
document.addEventListener('click', e=>{
    if(e.target.dataset.short){
        const url = `${window.location.origin}/${e.target.dataset.short}`; // trae por defecto la url actual

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