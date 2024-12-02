function insert_or_changue_img(img,id) {
    const Container = document.getElementById(id);
    if(img !== null){
        Container.setAttribute("src",img) 
    }else{
        console.log("Elija Una Imagen")
    }
    
    
}
function insert_or_changue_title(title,id) {
    const Container = document.getElementById(id);
    if(title !== null){
        Container.innerHTML = title;
    }else{
        Container.innerHTML = "texto invalido";
    }
    
    
}


function changue_background_color(color,id) {
    const Container = document.getElementById(id);
    if(color !== null){
        Container.style.backgroundColor=color;
    }else{
        Container.style.backgroundColor="white";
    }
    
    
}

