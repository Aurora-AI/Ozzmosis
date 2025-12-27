# PowerQuery (M) — Transformação “arquivos CSV” (consulta-cartoes-solicitados)

## Contexto

Script M para importar um CSV delimitado por `;`, limpar cabeçalhos/linhas iniciais e enriquecer os dados com a coluna **LOJA** a partir do **CNPJ** (mapeamento CNPJ → “LOJA NN BAIRRO”).

## Fonte / Entrada

- Arquivo: `consulta-cartoes-solicitados.csv`
- Delimitador: `;`
- Observação: o caminho original apontava para um diretório local; aqui foi **sanitizado** para um placeholder.

## Transformações principais (resumo)

- Importa o CSV com encoding UTF-8.
- Converte colunas iniciais para `text`.
- Remove as 4 primeiras linhas e promove cabeçalhos.
- Define tipos (inclui datas).
- Duplica `CNPJ` → `LOJA` e preenche `LOJA` via mapa `CNPJ (somente dígitos)` → nome da loja.
- Separa `Data de entrada` e `Data Finalizada` em data/hora e mantém apenas a parte de data.

## Script (M)

```powerquery
let
    Fonte = Csv.Document(
        File.Contents("<CAMINHO_PARA_CSV>/consulta-cartoes-solicitados.csv"),
        [Delimiter=";", Columns=16, Encoding=65001, QuoteStyle=QuoteStyle.None]
    ),

    #"Tipo Alterado" = Table.TransformColumnTypes(Fonte,{
        {"Column1", type text}, {"Column2", type text}, {"Column3", type text}, {"Column4", type text},
        {"Column5", type text}, {"Column6", type text}, {"Column7", type text}, {"Column8", type text},
        {"Column9", type text}, {"Column10", type text}, {"Column11", type text}, {"Column12", type text},
        {"Column13", type text}, {"Column14", type text}, {"Column15", type text}, {"Column16", type text}
    }),

    #"Linhas Superiores Removidas" = Table.Skip(#"Tipo Alterado", 4),
    #"Cabeçalhos Promovidos" = Table.PromoteHeaders(#"Linhas Superiores Removidas", [PromoteAllScalars=true]),

    #"Tipo Alterado1" = Table.TransformColumnTypes(#"Cabeçalhos Promovidos",{
        {"CNPJ", type text}, {"Número da Proposta", Int64.Type}, {"Nome do usuário", type text}, {"CPF", type text},
        {"Telefone", type text}, {"E-mail", type text}, {"Situação", type text}, {"Data de entrada", type datetime},
        {"Canal de entrada", type text}, {"Data Finalizada", type datetime}, {"Canal finalizado", type text},
        {"Seguro", type text}, {"Nome Promotor", type text}, {"Perfil Promotor", type text}, {"Indicação", type text},
        {"Nome indicação", type text}
    }),

    // 1) Duplicar a coluna CNPJ
    #"CNPJ Duplicado" = Table.DuplicateColumn(#"Tipo Alterado1", "CNPJ", "LOJA"),

    // 2) Mapa CNPJ(só dígitos) -> "LOJA NN BAIRRO"
    LojaPorCnpj = [
    #"07316252000769" = "LOJA 01 PINHEIRINHO",
    #"03749830000295" = "LOJA 02 PIONEIROS",
    #"07316252000840" = "LOJA 03 PIONEIROS",
    #"07316252000688" = "LOJA 04 ALTO MARACANÃ",
    #"03749830000376" = "LOJA 05 PIONEIROS",
    #"07316252000173" = "LOJA 06 CENTRO",
    #"03749830000457" = "LOJA 07 CENTRO",
    #"07316252000254" = "LOJA 08 JD PAULISTA",
    #"03749830000619" = "LOJA 09 PINHEIRINHO",
    #"07316252000416" = "LOJA 10 EUCALIPTOS",
    #"07316252000335" = "LOJA 11 CENTRO",
    #"07316252000505" = "LOJA 12 CENTRO",
    #"03749830000538" = "LOJA 13 CENTRO",
    #"07316252001064" = "LOJA 14 JD PAULISTA",
    #"07316252000920" = "LOJA 15 CENTRO",
    #"07316252001145" = "LOJA 16 CENTRO",
    #"07316252001307" = "LOJA 17 SÃO GABRIEL",
    #"07316252001226" = "LOJA 18 CENTRO",
    #"07316252001498" = "LOJA 19 GUARAITUBA",
    #"07316252001579" = "LOJA 20 CENTRO",
    #"07316252001650" = "LOJA 21 CAJURU"
],

    // 3) Substituir o valor da coluna duplicada ("LOJA") pelo nome da loja conforme o CNPJ
    #"LOJA Preenchida" = Table.TransformColumns(
        #"CNPJ Duplicado",
        {
            {
                "LOJA",
                (cnpj as text) as nullable text =>
                    let
                        cnpjDigits = Text.Select(cnpj, {"0".."9"}),
                        valor = if Record.HasFields(LojaPorCnpj, cnpjDigits) then Record.Field(LojaPorCnpj, cnpjDigits) else null
                    in
                        valor,
                type text
            }
        }
    ),

    #"Dividir Coluna por Delimitador" = Table.SplitColumn(
        Table.TransformColumnTypes(#"LOJA Preenchida", {{"Data de entrada", type text}}, "pt-BR"),
        "Data de entrada",
        Splitter.SplitTextByDelimiter(" ", QuoteStyle.Csv),
        {"Data de entrada.1", "Data de entrada.2"}
    ),
    #"Tipo Alterado2" = Table.TransformColumnTypes(#"Dividir Coluna por Delimitador",{{"Data de entrada.1", type date}, {"Data de entrada.2", type time}}),
    #"Colunas Removidas" = Table.RemoveColumns(#"Tipo Alterado2",{"Data de entrada.2"}),

    #"Dividir Coluna por Delimitador1" = Table.SplitColumn(
        Table.TransformColumnTypes(#"Colunas Removidas", {{"Data Finalizada", type text}}, "pt-BR"),
        "Data Finalizada",
        Splitter.SplitTextByDelimiter(" ", QuoteStyle.Csv),
        {"Data Finalizada.1", "Data Finalizada.2"}
    ),
    #"Tipo Alterado3" = Table.TransformColumnTypes(#"Dividir Coluna por Delimitador1",{{"Data Finalizada.1", type date}, {"Data Finalizada.2", type time}}),
    #"Colunas Removidas1" = Table.RemoveColumns(#"Tipo Alterado3",{"Data Finalizada.2"})
in
    #"Colunas Removidas1"
```

