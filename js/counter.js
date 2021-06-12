// Visitor counter

document.addEventListener('DOMContentLoaded', () =>{
    
    let visitorCounter = document.getElementById('visitorcount') 
    
    if(localStorage){
        if(localStorage['visitors'] == undefined){
            localStorage['visitors'] = 0
        }
    
        let n = parseInt(localStorage['visitors'])
        
        localStorage['visitors'] = 1 + n
        
        let counter = localStorage['visitors']
    
        let message = counter
    
        visitorCounter.innerText = `Number of visitors: ${message}`
    }
})