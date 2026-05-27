 function validarLogin() {
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();

      
      if (!email.includes("@")) {
        alert("Por favor, insira um email válido contendo '@'.");
        return;
      }
  
      
      if (senha.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres.");
        return;
      }

     
      alert("Login válido! Dados prontos para envio.");
      
    }
 