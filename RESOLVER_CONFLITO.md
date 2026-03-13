# Como resolver conflito do PR (rápido)

Se no GitHub aparecer **"This branch has conflicts that must be resolved"**, rode estes comandos na branch do PR:

```bash
bash scripts/resolver-conflito-pr.sh main origin
```

## O que o script faz
1. Confere se você está em um repositório git e fora da branch `main`.
2. Confere se o remote `origin` existe.
3. Faz `fetch` da `main`.
4. Tenta `merge` da `main` na sua branch.
5. Se houver conflito, lista os arquivos e mostra os próximos passos.

## Depois de resolver os conflitos
```bash
git add .
git commit -m "resolve: merge conflicts with main"
git push -u origin <sua-branch>
```
