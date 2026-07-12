content = open('app/dashboard/page.tsx', 'r', encoding='utf-8').read()

# 1. Change tasks.map to collapsed version
old_map = '{tasks.map((task) => ('
new_map = '{(taskCollapsed ? tasks.slice(0, 3) : tasks).map((task) => ('
content = content.replace(old_map, new_map, 1)

# 2. Find the closing ))} before </div> and add expand button
old_close = [ln for ln in content.split('\n') if ')});' in ln or ')}' in ln and '))' in ln or '            ))}' in ln]
# More targeted: find the exact pattern
import re
# Find the })}\n            </div> pattern
pattern = r'(\s*\)}}\)\s*\n\s*</div>\s*\n\s*</section>)'
# Add expand button before the </div>
expand_btn = '''
            {/* expand/collapse button */}
            {tasks.length > 3 && (
              <button
                onClick={() => setTaskCollapsed(!taskCollapsed)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
              >
                <ChevronDown className={h-4 w-4 transition-transform $ + {taskCollapsed ? "" : "rotate-180"} + }} />
                {taskCollapsed ?  + "" + \u5c55\u5f00\u5168\u90e8 (\u5171$ + {tasks.length} + \u4e2a\u4efb\u52a1) + "" +  : "\u6536\u8d77"}
              </button>
            )}
'''
# This escaping is getting complex, let me just do simple search and replace
f.close()
