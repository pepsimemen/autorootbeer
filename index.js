/**
 * Made by Loggeru <3
 */

module.exports = function LetMeDrink(mod) {

    const skills = require('./skills'),
		command = mod.command || mod.require.command

    let enabled = true,
        gameId = null,
        job = null,
        onCd = false,
        getInfoCommand = false

    command.add('letmedrink', () => {
        enabled = !enabled
        command.message('[LetMeDrink] ' + (enabled ? 'Enabled' : 'Disabled'))
    })

    command.add('getskillinfo', () => {
        getInfoCommand = true
        command.message('Use the desired skill and check proxy console.')
    })

    mod.hook('S_LOGIN', mod.majorPatchVersion >= 86 ? 14 : 13, event => {
        gameId = event.gameId
        job = (event.templateId - 10101) % 100
    })

    mod.hook('C_START_SKILL', 7, { order: -10 }, event => {
        if (!enabled) return

        let sInfo = getSkillInfo(event.skill.id)

        if (getInfoCommand) {
            console.log('Skill info: (group: ' + sInfo.group + ' / job: ' + job + ')')
            getInfoCommand = false
        }

        for (let s = 0; s < skills.length; s++) {
            if (skills[s].group == sInfo.group && skills[s].job == job && !onCd) {
                useItem()
                break
            }
        }
    })
	
	mod.hook('C_NOTIMELINE_SKILL', 3, { order: -10 }, event => {
        if (!enabled) return

        let sInfo = getSkillInfo(event.skill.id)
		
        if (sInfo.group == 18 && job == 8 && !onCd) useItem()
    })

    function useItem() {
        mod.toServer('C_USE_ITEM', 3, {
            gameId: gameId,
            id: 80081,
        })
        onCd = true
        setTimeout(function () { onCd = false }, 60000)
    }

    function getSkillInfo(id) {
        let nid = id// -= 0x4000000
        return {
            id: nid,
            group: Math.floor(nid / 10000),
            level: Math.floor(nid / 100) % 100,
            sub: nid % 100
        }
    }
}