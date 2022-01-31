# coding=utf-8
import jieba
import paddle
import jieba.posseg as pseg
paddle.enable_static()
jieba.enable_paddle()  # 启动 paddle 模式。0.40版之后开始支持，早期版本不支持
jieba.load_userdict('./extra_dict/merge_hangzhou_ns.txt')
# jieba.add_word('莫衙营', 1000, 'ns')
jieba.suggest_freq('莫衙营巷口', True)
def split_string (test_sent):
  split_arr  = []
  key_arr = []
  for line_word in test_sent.splitlines():
    # print(line_word)
    line_word = line_word.strip()
    if(line_word == '\n'):
        continue
    line_positions = []
    line_times = []
    line_names = []
    line_others = []
    seg_list = pseg.cut(line_word, use_paddle=True, HMM=False)
    for word, flag in seg_list:
        split_arr.append({
          'flag': flag,
          'word': word
        })
        if(flag == 'ns' or flag == 'LOC' or flag == 'nt'):
            line_positions.append(word)
        elif(flag == 'TIME'):
            line_times.append(word)
        elif(flag == 'nr' or flag == 'PER'):
            line_names.append(word)
        else:
            line_others.append(word)
    line_map = {
        'time': line_times,
        'position': line_positions,
        'name': line_names
    }
    if(len(line_positions) > 0 and len(line_times) > 0):
        # print(line_map)
        key_arr.append(line_map)
        # print('\n')
  return split_arr
