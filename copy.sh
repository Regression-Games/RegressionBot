tsc
rm -rf ~/Projects/RG/GameMachine/assemblies/usercode_standalone/tmp_user_code/my_code/15/B_CTFBot/node_modules/rg-bot
rm -rf ~/Projects/CTFBot/node_modules/rg-bot
rm -rf ~/Projects/RG/GameMachine/assemblies/usercode_standalone/ai-engines/mineflayer-engine/node_modules/rg-bot
rm -rf ~/Projects/rg-ctf-utils/node_modules/rg-bot
cp -R ./ ~/Projects/RG/GameMachine/assemblies/usercode_standalone/tmp_user_code/my_code/15/B_CTFBot/node_modules/rg-bot
cp -R ./ ~/Projects/RG/GameMachine/assemblies/usercode_standalone/ai-engines/mineflayer-engine/node_modules/rg-bot
cp -R ./ ~/Projects/CTFBot/node_modules/rg-bot
cp -R ./ ~/Projects/rg-ctf-utils/node_modules/rg-bot