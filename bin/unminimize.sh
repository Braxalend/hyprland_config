#!/usr/bin/env bash
# Возврат свёрнутого окна из спец-воркспейса special:minimized.
# Показывает меню fuzzel со свёрнутыми окнами; выбранное возвращает
# на ТЕКУЩИЙ воркспейс и фокусирует. Биндится на SUPER+S (по кейкоду).
set -euo pipefail
export XDG_RUNTIME_DIR="/run/user/$(id -u)"

# Собираем свёрнутые окна: address<TAB>подпись
mapfile -t rows < <(hyprctl clients -j | jq -r '
  .[] | select(.workspace.name=="special:minimized")
  | "\(.address)\t\(.class) — \(.title)"')

if [ ${#rows[@]} -eq 0 ]; then
  notify-send "Hyprland" "Свёрнутых окон нет"
  exit 0
fi

# Параллельные массивы: адреса и подписи
addrs=(); labels=()
for r in "${rows[@]}"; do
  addrs+=("${r%%$'\t'*}")
  labels+=("${r#*$'\t'}")
done

# Если свёрнутое одно — вернуть сразу без меню
if [ ${#addrs[@]} -eq 1 ]; then
  idx=0
else
  idx=$(printf '%s\n' "${labels[@]}" | fuzzel --dmenu --index --prompt "Вернуть окно: ") || exit 0
fi
[ -z "${idx:-}" ] && exit 0

addr="${addrs[$idx]}"
ws=$(hyprctl activeworkspace -j | jq -r '.id')
hyprctl dispatch movetoworkspace "${ws},address:${addr}"
hyprctl dispatch focuswindow "address:${addr}"
