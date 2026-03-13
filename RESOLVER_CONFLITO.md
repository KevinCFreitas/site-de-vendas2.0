# Como resolver conflito do PR (rápido)

Se no GitHub aparecer **"This branch has conflicts that must be resolved"**, rode na branch do PR:

```bash
bash scripts/resolver-conflito-pr.sh main origin
```

## Auto-resolução para front-end (opcional)
Se o conflito for principalmente em `index.html`, `styles.css` e `script.js`, você pode manter a versão atual da sua branch automaticamente:

```bash
bash scripts/resolver-conflito-pr.sh main origin ours-frontend
```

Esse modo:
1. Tenta merge da `main`.
2. Se houver conflito, aplica `--ours` para arquivos de front-end.
3. Faz commit automático da resolução.

## Depois
```bash
git push -u origin <sua-branch>
```
