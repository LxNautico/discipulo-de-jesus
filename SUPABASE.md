# Ativar os saves do Supabase

## Indicador do save

O cabeçalho apresenta o estado do envio e leva a Conta e saves ao clicar. Essa tela mostra último envio confirmado e último recebimento aplicado, em America/Sao_Paulo. Os metadados ficam separados por ID da conta em `discipulo-cloud-status:{user_id}` e não entram nos backups. Datas só são registradas após confirmação da gravação pelo servidor, usando `updated_at`; instalações antigas precisam de mais uma sincronização para começar esse registro.

Uma assinatura determinística dos dados efetivamente enviados detecta novas alterações, inclusive quando o usuário edita durante uma requisição. A assinatura não é mecanismo de segurança ou validação antifraude. O envio automático registra somente os dados capturados para aquela gravação, não presume que o estado local recebeu a união remota. Se houver dados remotos adicionais, o indicador orienta usar a sincronização manual para recebê-los. O indicador não monitora mudanças futuras de outros aparelhos em tempo real.

Estados: modo local; aguardando primeiro envio confirmado; alterações aguardando envio; sem conexão; sincronizando; envio não confirmado; envio confirmado com dados a receber; envio confirmado. Não se usa um rótulo de sincronização global completa após apenas um upload. Falhas não atualizam a data do último envio confirmado. Alterações locais, troca de rede e eventos de outros separadores atualizam o estado; não se recarrega a tela apenas para atualizar o indicador.

## Corrigir retorno de confirmação de e-mail

Se o e-mail chega, mas o clique termina num site inexistente, confira **Authentication → URL Configuration**. O Site URL é o retorno padrão e cada URL informada pelo aplicativo precisa constar em Redirect URLs. Para nosso servidor no computador, configure `http://localhost:4173/`; para abrir pelo Wi-Fi e confirmar pelo telefone, adicione também `http://192.168.1.128:4173/`, conferindo se esse ainda é o IP atual. Se usar Live Server, adicione o endereço completo real, incluindo subpasta e index.html. Não use file:// como retorno.

O cadastro e “Reenviar confirmação” agora informam o endereço HTTP(S) da página atual, sem parâmetros ou fragmentos de autenticação. Na edição portátil file://, o retorno depende do Site URL configurado no Supabase. A eventual opção `authRedirectUrl` de GameCloudConfig permite fixar um endereço HTTP(S) no futuro. Após ajustar o painel, solicite um novo e-mail no jogo e use o mais recente. Não compartilhe links de confirmação, pois contêm tokens.

A conta de jogador é separada da conta administrativa do Supabase: use um e-mail que você controla e uma senha criada para o jogo. Pode ser o mesmo endereço de e-mail do painel, mas o cadastro e a senha são independentes. Se o erro ocorreu somente depois da validação do e-mail, a conta pode já estar confirmada; tente entrar antes de pedir um novo envio.

O código usa o projeto `https://armyenrawxzyaxznhfai.supabase.co` e a chave pública fornecida pelo usuário. Não há chave administrativa no jogo. O SDK oficial `@supabase/supabase-js` versão 2.118.0 foi incluído como `supabase-sdk.js`, obtido de https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js . A biblioteca é distribuída sob licença MIT: https://github.com/supabase/supabase-js/blob/master/LICENSE .

## 1. Preparar o banco

No painel desse projeto, abra **SQL Editor → New query**. Copie o conteúdo de `supabase-setup.sql` e execute em **Run**. Ele cria somente `public.discipulo_saves`, suas políticas e a função de sincronização. Não altera tabelas de outros jogos.

O usuário autenticado pode ler e gravar apenas a linha cujo `user_id` é seu `auth.uid()`. Não há acesso de usuários anônimos, política pública ou uso de chave secret/service_role. A função usa SECURITY INVOKER e exige revisão esperada; gravações concorrentes retornam conflito para releitura e união. As instruções SQL foram revisadas localmente, mas precisam ser executadas e testadas no seu projeto.

## 2. Login e confirmação

Em **Authentication → Sign In / Providers → Email** (os rótulos podem variar), deixe e-mail e senha habilitados e mantenha a confirmação de e-mail para uso público.

Em **Authentication → URL Configuration**, configure Site URL e Redirect URLs para o endereço real de teste. Com nosso servidor, use `http://localhost:4173/` para testes no computador e adicione o endereço Wi-Fi atual para testes no celular, por exemplo `http://192.168.1.128:4173/`. Localhost em um e-mail aberto no celular aponta para o próprio celular; prefira confirmar no computador enquanto estiver testando ou usar o endereço Wi-Fi. Na publicação, troque pelo endereço HTTPS definitivo. Evite curingas amplos em produção.

O envio de confirmação depende da configuração de e-mail do Supabase. O serviço padrão tem limites e restrições; se as mensagens não chegarem aos testadores, configure SMTP próprio conforme a documentação. Não é necessário desabilitar a confirmação para resolver isso.

## 3. Testar no jogo

1. Abra o jogo atualizado e entre em **Conta e saves**.
2. Crie uma conta de jogador, confirme o e-mail quando solicitado e entre com e-mail e senha. Essa senha é da conta de jogador, não a senha do banco.
3. Clique em **Vincular meu progresso e sincronizar**. Os dados locais serão unidos aos da conta, salvos no Supabase e aplicados após recarregar.
4. No outro aparelho, entre na mesma conta e clique em **Sincronizar agora**. Seus estudos, reflexões e emblemas deverão aparecer.
5. Se desejar, ative **Enviar saves automaticamente**. O envio ocorre após alterações locais e ao reconectar. Para receber dados de outro aparelho e atualizar a interface local, use a sincronização manual.

## Comportamento e limites

- O modo sem conexão continua usando localStorage. O Supabase só funciona com internet; o SDK está embutido também no pacote portátil.
- O primeiro envio e o vínculo são manuais. Um progresso vinculado a outra conta não é enviado nem unido automaticamente. Use a conta original ou um perfil de navegador separado.
- Sair da conta não apaga os dados locais. Esta versão não separa múltiplos perfis no mesmo armazenamento do navegador.
- Sessões ficam em `discipulo-auth-v1` e são excluídas dos backups. Senhas não são gravadas pelo código do jogo.
- O envio remoto não altera o progresso local; a sincronização manual aplica a união após confirmação por clique e recarrega a página. Uma falha de rede mantém o jogo local.
- Conclusões são unidas sem duplicação. Textos diferentes são preservados com separador; a união reconhece blocos já importados para não aumentar as notas a cada sincronização. Exclusões não são propagadas: apagar uma nota local pode não removê-la da nuvem nesta primeira versão.
- A revisão otimista evita sobrescrever um save concorrente; após três conflitos, a interface pede nova tentativa. A tabela guarda a versão atual, sem histórico remoto. Continue usando backups JSON para recuperar versões anteriores.
- Os critérios de XP ainda são calculados pelo aplicativo. Isso serve para um jogo de estudo, mas não é uma arquitetura antifraude para rankings competitivos.

Referências: https://supabase.com/docs/guides/database/postgres/row-level-security , https://supabase.com/docs/guides/getting-started/api-keys , https://supabase.com/docs/guides/auth/redirect-urls .
