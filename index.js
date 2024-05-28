import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

let lista = [];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'A15bcf25',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 15
    }
}));

app.use(cookieParser());

function usuarioEstaAutenticado(requisicao, resposta, next){
    if (requisicao.session.usuarioAutenticado){
        next();
    }
    else{
        resposta.redirect('/login.html');
    }
}

function cadastrarProduto(requisicao, resposta){
    const nome = requisicao.body.nome;
    const codigo = requisicao.body.codigo;
    const descricao = requisicao.body.descricao;
    const custo = requisicao.body.custo;
    const venda = requisicao.body.venda;
    const validade = requisicao.body.validade;
    const quantidade = requisicao.body.quantidade;

    if(nome && codigo && descricao && custo && venda && validade && quantidade){
        lista.push({
            nome: nome,
            codigo: codigo,
            descricao: descricao,
            custo: custo,
            venda: venda,
            validade: validade,
            quantidade: quantidade
        });
        resposta.redirect('/listar');
    }
    else{
        resposta.write(`<!DOCTYPE html>
        <html lang="pt-br">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
        
        <body>
            <h1 class="text-center mt-3">Cadastro De Produtos</h1><br><br>
            <div class="container mb-5">
                <form method="POST" action='/cadastrarProduto' class=" border row g-2">
                    <div class="mb-3">
                        <label for="nome" class="form-label">Nome do fabricante:</label><br>
                        <input type="text" class="form-control" id="nome" name="nome" value="${nome}">`);
        if(nome == ""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe o nome do fabricante!
                        </div>
            `);
        }
        resposta.write(`</div>
        <div class="mb-3">
            <label for="codigo" class="form-label">Código de barras:</label><br>
            <input type="text" class="form-control" id="codigo" name="codigo" value="${codigo}">`);
        if(codigo == ""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe o código de barras!
                        </div>
            `);
        }
        resposta.write(`</div>
        <div class="mb-3">
            <label for="descricao" class="form-label">Descrição do produto:</label><br>
            <input type="text" class="form-control" id="descricao" name="descricao" value="${descricao}">`);
        if(descricao == ""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe a descrição do produto!
                        </div>
            `);
        } 
        resposta.write(`</div>
        <div class="mb-3">
            <label for="custo" class="form-label">Preço de custo:</label><br>
            <input type="text" class="form-control" id="custo" name="custo" value="${custo}">`);
        if(custo == ""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe o preço de custo!
                        </div>
            `);
        }
        resposta.write(`</div>
        <div class="mb-3">
            <label for="venda" class="form-label">Preço de venda:</label><br>
            <input type="text" class="form-control" id="venda" name="venda" value="${venda}">`);
        if(venda == ""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe o preço de venda!
                        </div>
            `);
        }
        resposta.write(`</div>
        <div class="col-md-5">
            <label for="validade" class="form-label">Data de validade:</label><br>
            <input type="text" class="form-control" id="validade" name="validade" value="${validade}">`);
        if(validade == ""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe a validade!
                        </div>
            `);
        }
        resposta.write(`</div>
        <div class="col-md-4">
            <label for="quantidade" class="form-label">Quantidade em estoque:</label><br>
            <input type="text" class="form-control" id="quantidade" name="quantidade" value="${quantidade}">`);
        if(quantidade == ""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe a quantidade!
                        </div>
            `);
        }
        resposta.write(`</div>
                        <div class="text-center">
                        <div class="col-12 mb-3 mt-3">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                            <a class="btn btn-secondary" href="/">Voltar</a>
                        </div>
                        </div>  
                    </form>
                </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                crossorigin="anonymous"></script>

                </html>`);
        resposta.end();                                               
    }
}

function autenticarUsuario(requisicao, resposta){
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'admin' && senha == '123'){
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(),{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else{
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html lang="pt-br>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Erro ao logar</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuario ou senha invalidos!</p>');
        resposta.write('<script type="text/javascript">   function Redirect() { window.location="/login.html"; }  setTimeout(\'Redirect()\', 5000);</script>');
        resposta.write(`<script type="text/javascript"> document.write("Voce vai ser redirecionado pra tela de login");</script>`);
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
}

app.post('/login', autenticarUsuario);

app.get('/login', (req,resp)=>{
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/login.html');
});

app.use(express.static(path.join(process.cwd(), 'publico')));

app.use(usuarioEstaAutenticado,express.static(path.join(process.cwd(), 'protegido')));

app.post('/cadastrarProduto', usuarioEstaAutenticado, cadastrarProduto);

app.get('/listar', usuarioEstaAutenticado, (req,resp)=>{
    resp.write('<!DOCTYPE html>');
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<meta charset="utf-8">');
    resp.write('<title>Listar</title>');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">');
    resp.write('</head>');
    resp.write('<body>');
    resp.write("<h1 class='text-center mt-3'>Lista de produtos</h1>");
    resp.write('<br>');
    resp.write('<br>');
    resp.write('<div class="container">');
    resp.write('<table class="table table-dark table-striped-columns">');
    resp.write('<tr>');
    resp.write('<th class="text-center">Nome do fabricante</th>');
    resp.write('<th class="text-center">Código de barras</th>');
    resp.write('<th class="text-center">Descrição do produto</th>');
    resp.write('<th class="text-center">Preço de custo</th>');
    resp.write('<th class="text-center">Preço de venda</th>');
    resp.write('<th class="text-center">Data de validade</th>');
    resp.write('<th class="text-center">Quantidade em estoque</th>');
    resp.write('</tr>');
    for(let i=0; i<lista.length; i++){
        resp.write('<tr>');
        resp.write(`<td>${lista[i].nome}`);
        resp.write(`<td>${lista[i].codigo}`);
        resp.write(`<td>${lista[i].descricao}`);
        resp.write(`<td>${lista[i].custo}`);
        resp.write(`<td>${lista[i].venda}`);
        resp.write(`<td>${lista[i].validade}`);
        resp.write(`<td>${lista[i].quantidade}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Inicio</a>');
    resp.write('</div>');
    if (req.cookies.dataUltimoAcesso){
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }
    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>');
    resp.write('</html>');
    resp.end();
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});