OPERATORS = {
    "=":  lambda a, b : a == b,
    "<=": lambda a, b : a <= b,
    "<":  lambda a, b : a < b,
    ">=": lambda a, b : a >= b,
    ">":  lambda a, b : a > b
}

def threshold(categories: list, metric: str, threshold: list[str, int]) -> float:
    values = list()
    for category in categories:
        for ind in category.index:
            val = category[metric][ind]

            if type(val) == str:
                val = float(val.replace(',', '.'))
            
            values.append(val)

    if len(values) == 0:
        return 0.0
    print(metric, values)
    violations = 0
    op, t = threshold
    for val in values:
        if not OPERATORS[op](val, t):
            violations = violations + 1

    return violations / len(values)

def compute_percentages_understand(categories: dict, config: dict[str, dict]) -> dict[str, float]:
    percentages = dict()
    for key, val in config.items():
        dfs = [categories[t] for t in val['type'] if t in categories]
        percentages[key] = threshold(dfs, val['metric'], val['threshold'])
    
    return percentages